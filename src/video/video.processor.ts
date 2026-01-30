import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CacheService } from 'src/cache/cache.service';
import { FfmpegService } from 'src/ffmpeg/ffmpeg.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import * as fs from 'fs/promises';
import * as path from 'path';
import { VideoSseService } from './videoSse.service';

@Processor('video-processing')
export class VideoProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepo: Repository<Video>,
        private readonly cache: CacheService,
        private readonly ffmpeg: FfmpegService,
        private readonly storage: StorageService,
        private readonly config: ConfigService,
        private readonly videoSseService: VideoSseService
    ) {
        super();
    }

    async process(job: Job): Promise<any> {
        const { videoId, userId, file } = job.data;
        const lockKey = `video:lock:${videoId}`;

        if (await this.cache.get(lockKey)) {
            return { skipped: true };
        }
        await this.cache.set(lockKey, true, 600);

        try {
            // 1. Check existing video
            const existing = await this.videoRepo.findOne({ where: { id: videoId } });

            if(!existing) throw new Error("video not found");

            if (existing.status === 'ACTIVE') return { alreadyProcessed: true };

            // 2. Prepare file paths
            const ext = file.originalname.split('.').pop();
            const originalFilePath = `videos/${videoId}/original.${ext}`;

            // Convert serialized buffer to actual Buffer
            const bufferData = Buffer.isBuffer(file.buffer)
                ? file.buffer
                : Buffer.from(file.buffer.data);

            // 3. Upload original file
            await this.storage.upload(originalFilePath, Readable.from(bufferData), file.mimetype);

            // 4. Save to assets folder (only JSON-safe operations)
            const rootFolder = '/home/parmesh/Desktop/Backend-Nest/NestJs/project';
            const assetsVideoDir = path.join(rootFolder, 'assets', 'video');
            const savedFilePath = path.join(assetsVideoDir, file.originalname);
            await fs.mkdir(assetsVideoDir, { recursive: true });
            await fs.writeFile(savedFilePath, bufferData);

            // 6. Verify file exists
            try {
                await fs.access(savedFilePath);
            } catch {
                await this.videoRepo.delete(videoId);
                return { error: 'Uploaded file missing, aborted.' }; // safe return
            }

            // 7. Generate HLS
            const outputDir = `/home/parmesh/Desktop/Backend-Nest/NestJs/tmp/hls/${videoId}`;
            await this.ffmpeg.generateHls(savedFilePath, outputDir);

            // 8. Upload HLS master playlist
            const masterPath = await this.storage.uploadHls(videoId, outputDir);

            try {
                await fs.rm(outputDir, { recursive: true, force: true });
                console.log(`Temporary HLS folder removed: ${outputDir}`);
            } catch (err) {
                console.warn(`Failed to remove temporary folder ${outputDir}:`, err);
            }

            // 9. Update DB
            await this.videoRepo.update(videoId, {
                path: masterPath,
                bucket: this.config.get('SUPABASE_BUCKET'),
                status: 'ACTIVE',
            });

            this.videoSseService.sendSuccess(videoId, "ACTIVE")

            return { success: true, videoId, masterPath }; // return JSON-safe info
        } catch (error: any) {
            console.error('Video processing failed:', error);
            await this.videoRepo.update(videoId, {
                status: "FAILED"
            });
            this.videoSseService.sendError(videoId, error, "FAILED");
            return { success: false, error: error.message }; // return JSON-safe error
        } finally {
            await this.cache.del(lockKey);
        }
    }
}
