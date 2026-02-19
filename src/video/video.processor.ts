import { Processor, WorkerHost } from "@nestjs/bullmq";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bullmq";
import * as path from "path";
import * as fs from "fs/promises";
import axios from "axios";

import { FfmpegService } from "../ffmpeg/ffmpeg.service";
import { CacheService } from "../cache/cache.service";
import { Readable } from "stream";

@Processor('video-processing')
export class VideoProcessor extends WorkerHost {
    constructor(
        private readonly cache: CacheService,
        private readonly ffmpeg: FfmpegService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async process(job: Job): Promise<any> {
        const { videoId, file } = job.data;
        const lockKey = `video:lock:${videoId}`;

        const MAIN_SERVER_URL = this.configService.get<string>("MAIN_SERVER_URL");
        const secret = this.configService.get<string>("SECRET");

        if (await this.cache.get(lockKey)) {
            return { skipped: true };
        }

        await this.cache.set(lockKey, true, 600);

        try {
            const existingVideo = await axios.get(
                `${MAIN_SERVER_URL}/video/${videoId}`,
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            if (!existingVideo.data.data) throw new NotFoundException("video not found");

            if (existingVideo.data.data.status === 'ACTIVE') return { alreadyProcessed: true };
            if (existingVideo.data.data.status !== 'PROCESSING') throw new BadRequestException({ message: "Invalid request" });

            const ext = file.originalname.split('.').pop();
            const originalFilePath = `videos/${videoId}/original.${ext}`;

            const bufferData = Buffer.isBuffer(file.buffer)
                ? file.buffer
                : Buffer.from(file.buffer.data);

            await axios.post(
                `${MAIN_SERVER_URL}/storage/upload`,
                {
                    data: {
                        path: originalFilePath,
                        stream: Readable.from(bufferData),
                        mimeType: file.mimeType
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            const rootFolder = this.configService.get("ROOT_DIRECTORY");
            const assetsVideoDir = path.join(rootFolder, 'assets', 'video');
            const savedFilePath = path.join(assetsVideoDir, file.originalname);
            await fs.mkdir(assetsVideoDir, { recursive: true });
            await fs.writeFile(savedFilePath, bufferData);

            try {
                await fs.access(savedFilePath);
            } catch {
                await axios.delete(
                    `${MAIN_SERVER_URL}/video/${videoId}`,
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
                throw new NotFoundException('Failed to save uploaded video file');
            }

            const outputDir = `${this.configService.get("OUTPUT_DIRECTORY")}/${videoId}`;
            await this.ffmpeg.generateHls(savedFilePath, outputDir);

            await axios.post(
                `${MAIN_SERVER_URL}/storage/${videoId}`,
                {
                    data: {
                        path: outputDir
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            try {
                await fs.rm(outputDir, { recursive: true, force: true });
                console.log(`Temporary HLS folder removed: ${outputDir}`);
            } catch (err) {
                console.warn(`Failed to remove temporary folder ${outputDir}:`, err);
            }

            await axios.put(
                `${MAIN_SERVER_URL}/video/${videoId}`,
                {
                    data: {
                        status: 'ACTIVE',
                        masterPath: `videos/${videoId}`,
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            return { success: true, videoId, masterPath: `videos/${videoId}` };
        } catch (error: any) {
            console.error('Video processing failed:', error.message);
            await axios.put(
                `${MAIN_SERVER_URL}/video/${videoId}`,
                {
                    data: {
                        status: "FAILED",
                        error: error.message
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            throw new Error(`Video processing failed: ${error.message}`);
        } finally {
            await this.cache.del(lockKey);
        }
    }
}
