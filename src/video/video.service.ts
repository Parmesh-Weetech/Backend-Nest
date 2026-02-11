import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import { APIResponse } from '../common/response/response.dto';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/entities/user.entity';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';

import { Video } from './entities/video.entity';
import { VideoSseService } from './videoSse.service';
import { VideoRepository } from './video.repository';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoRepository)
        private readonly videoRepository: VideoRepository,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,

        @InjectQueue('video-processing')
        private readonly videoQueue: Queue,
    ) { }
    async enqueue(file: Express.Multer.File, user: User): Promise<APIResponse> {
        const videoId = randomUUID();

        const videoMetadata = this.videoRepository.saveVideo(
            videoId,
            `videos/${videoId}`,
            "PENDING",
            user.id,
            file.originalname,
            file.mimetype,
            this.configService.get<string>("SUPABASE_BUCKET")!
        )

        if (!videoMetadata) throw new InternalServerErrorException('Failed to save video metadata');

        await this.videoQueue.add(
            'process',
            {
                videoId,
                userId: user.id,
                file: {
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    originalname: file.originalname,
                },
            },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnFail: {
                    age: 24 * 60 * 60,
                    count: 1000
                },
                removeOnComplete: {
                    age: 60 * 60,
                    count: 10
                },

            },
        );


        return {
            success: true,
            data: {
                id: videoId,
                status: "PENDING"
            },
            expired: false,
            message: "Video Uploaded Successfully",
            statusCode: 201,
        };
    }

    async findMasterFile(videoId: string) {
        const videoMetadata = await this.videoRepository.findById(videoId);
        if (!videoMetadata) throw new NotFoundException('Video not found');

        const stream = await this.storageService.download(`${videoMetadata.path}/master.m3u8`);

        return {
            stream,
            filename: videoMetadata.path.split('/').pop(),
            contentType: 'application/octet-stream'
        };
    }

    async findIndexFile(videoId: string, quality: string) {
        const video = await this.videoRepository.findById(videoId)
        if (!video) throw new NotFoundException('Video not found');

        const path = `videos/${videoId}/${quality}/index.m3u8`;
        const stream = await this.storageService.download(path);

        return {
            stream,
            filename: 'index.m3u8',
        };
    }

    async findSegment(
        videoId: string,
        quality: string,
        segment: string,
    ) {
        const video = await this.videoRepository.findById(videoId);
        if (!video) throw new NotFoundException('Video not found');

        if (segment.includes(".ts")) {
            const path = `videos/${videoId}/${quality}/${segment}`;
            const stream = await this.storageService.download(path);

            return {
                stream,
                filename: segment,
            };
        } else {
            const path = `videos/${videoId}/${quality}/${segment}.ts`;
            const stream = await this.storageService.download(path);

            return {
                stream,
                filename: segment,
            };
        }
    }

    async getVideoById(videoId: string) {
        return await this.videoRepository.findById(videoId);
    }

    async getSignedUrl(videoPath: string, originalVideoName: string) {
        const ext = originalVideoName.split('.').pop();
        return this.storageService.getSignedUrl(`${videoPath}/original.${ext}`);
    }
}
