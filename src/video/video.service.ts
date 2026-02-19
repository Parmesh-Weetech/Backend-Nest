import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import { APIResponse } from '../common/response/response.dto';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/entities/user.entity';

import { Video } from './entities/video.entity';
import { VideoSseService } from './videoSse.service';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,

        @InjectQueue('video-processing')
        private readonly videoQueue: Queue,

        private readonly videoSseService: VideoSseService
    ) { }
    async enqueue(file: Express.Multer.File, user: User): Promise<APIResponse> {
        if (file.size >= 5 * 1024 * 1024) {
            throw new BadRequestException('File size must be less than 5MB');
        }

        const videoId = randomUUID();

        const videoMetadata = this.videoRepository.create({
            id: videoId,
            path: `videos/${videoId}`,
            status: "PENDING",
            user: user,
            originalVideoName: file.originalname,
            bucket: this.configService.get<string>("SUPABASE_BUCKET")
        })

        const video = await this.videoRepository.save(videoMetadata);

        if (!video) throw new InternalServerErrorException('Failed to save video metadata');

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

        const updateVideoStatus = await this.videoRepository.update(
            videoId,
            {
                status: "PROCESSING"
            }
        )

        if (updateVideoStatus.affected === 0) throw new InternalServerErrorException({ message: "Failed to update status to processing" });

        return {
            success: true,
            data: {
                id: videoId,
                status: "PROCESSING"
            },
            expired: false,
            message: "Video Uploaded Successfully",
            statusCode: 201,
        };
    }

    async findMasterFile(videoId: string) {
        const videoMetadata = await this.videoRepository.findOne({ where: { id: videoId } });
        if (!videoMetadata) throw new NotFoundException('Video not found');

        const stream = await this.storageService.download(`${videoMetadata.path}/master.m3u8`);

        return {
            stream,
            filename: videoMetadata.path.split('/').pop(),
            contentType: 'application/octet-stream'
        };
    }

    async findIndexFile(videoId: string, quality: string) {
        const video = await this.videoRepository.findOne({ where: { id: videoId } });
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
        const video = await this.videoRepository.findOne({ where: { id: videoId } });
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
        const video = await this.videoRepository.findOne({ where: { id: videoId } });

        if (!video) {
            throw new NotFoundException({ message: "Video not found" });
        }

        return video;
    }

    async getSignedUrl(videoPath: string, originalVideoName: string) {
        const ext = originalVideoName.split('.').pop();
        return this.storageService.getSignedUrl(`${videoPath}/original.${ext}`);
    }

    async deleteVideoById(videoId: string): Promise<void> {
        await this.getVideoById(videoId);

        const affectedRow = await this.videoRepository.delete(videoId);

        if (affectedRow.affected === 0) {
            throw new InternalServerErrorException({ message: "Failed to delete video" });
        }
    }

    async updateVideoStatus(videoId: string, status: "PENDING" | "PROCESSING" | "ACTIVE" | "FAILED", masterPath: string | undefined, error: string | undefined) {
        await this.getVideoById(videoId);

        const affectedRow = await this.videoRepository.update(
            videoId,
            {
                path: masterPath,
                bucket: this.configService.get("SUPABASE_BUCKET"),
                status: status
            }
        )

        if (affectedRow.affected === 0) throw new InternalServerErrorException({ message: "Failed to update status of video" });

        if (status === "ACTIVE") {
            this.videoSseService.sendSuccess(videoId, status);
        } else if (status === "FAILED") {
            this.videoSseService.sendError(videoId, error || "Internal Server Error", status);
        } else {
            this.videoSseService.sendProcess(videoId, status);
        }
    }
}
