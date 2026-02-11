import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Readable } from 'stream';
import * as fs from 'fs/promises';
import * as path from 'path';

import { StorageService } from '../storage/storage.service';
import { CacheService } from '../cache/cache.service';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';

import { Video } from './entities/video.entity';
import { VideoSseService } from './videoSse.service';
import { VideoRepository } from './video.repository';

@Processor('video-processing')
export class VideoProcessor extends WorkerHost {
    constructor(
        @InjectRepository(VideoRepository)
        private readonly videoRepository: VideoRepository,
        private readonly cache: CacheService,
        private readonly ffmpeg: FfmpegService,
        private readonly storage: StorageService,
        private readonly config: ConfigService,
        private readonly videoSseService: VideoSseService
    ) {
        super();
    }

    async process(job: Job): Promise<any> {
        const { videoId, file } = job.data;
        const lockKey = `video:lock:${videoId}`;

        if (await this.cache.get(lockKey)) {
            return { skipped: true };
        }
        await this.cache.set(lockKey, true, 600);

        try {
            const existing = await this.videoRepository.findById(videoId);

            if(!existing) throw new NotFoundException("video not found");

            if (existing.status === 'ACTIVE') return { alreadyProcessed: true };

            const ext = file.originalname.split('.').pop();
            const originalFilePath = `videos/${videoId}/original.${ext}`;

            const bufferData = Buffer.isBuffer(file.buffer)
                ? file.buffer
                : Buffer.from(file.buffer.data);

            await this.storage.upload(originalFilePath, Readable.from(bufferData), file.mimetype);

            const rootFolder = this.config.get("ROOT_DIRECTORY");
            const assetsVideoDir = path.join(rootFolder, 'assets', 'video');
            const savedFilePath = path.join(assetsVideoDir, file.originalname);
            await fs.mkdir(assetsVideoDir, { recursive: true });
            await fs.writeFile(savedFilePath, bufferData);

            try {
                await fs.access(savedFilePath);
            } catch {
                await this.videoRepository.deleteVideo(videoId);
                throw new NotFoundException('Failed to save uploaded video file');
            }

            const outputDir = `${this.config.get("OUTPUT_DIRECTORY")}/${videoId}`;
            await this.ffmpeg.generateHls(savedFilePath, outputDir);

            const masterPath = await this.storage.uploadHls(videoId, outputDir);

            try {
                await fs.rm(outputDir, { recursive: true, force: true });
                console.log(`Temporary HLS folder removed: ${outputDir}`);
            } catch (err) {
                console.warn(`Failed to remove temporary folder ${outputDir}:`, err);
            }

            await this.videoRepository.updateVideo(videoId, 'ACTIVE', masterPath,
                this.config.get('SUPABASE_BUCKET')!);

            this.videoSseService.sendSuccess(videoId, "ACTIVE")

            return { success: true, videoId, masterPath };
        } catch (error: any) {
            console.error('Video processing failed:', error);
            await this.videoRepository.updateVideo(videoId, "FAILED");
            this.videoSseService.sendError(videoId, error, "FAILED");
            throw new Error(`Video processing failed: ${error.message}`);
        } finally {
            await this.cache.del(lockKey);
        }
    }
}
