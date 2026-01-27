import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/entities/user.entity';
import { Readable } from 'stream';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Response } from '../common/response/response.dto';
import { promises as fs } from 'fs';

@Injectable()
export class VideoService {
    constructor(
        private readonly storageService: StorageService,
        private readonly ffmpegService: FfmpegService,
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        private readonly configService: ConfigService
    ) { }
    async processVideo(file: Express.Multer.File, user: User): Promise<Response> {
        try {
            const videoId = randomUUID();

            const ext = file.originalname.split('.').pop();
            const originalFilePath = `videos/${videoId}/original.${ext}`;
            const segmentFilePath = `videos/${videoId}/**/*`;

            const fileStream = Readable.from(file.buffer);

            await this.storageService.upload(originalFilePath, fileStream, file.mimetype);

            const signedUrl = await this.storageService.getSignedUrl(originalFilePath, 86400);

            const outputDir = `/home/parmesh/Desktop/Backend-Nest/NestJs/tmp/hls/${videoId}`;

            try {
                await this.ffmpegService.generateHls("assets/video/30902-383991325_small.mp4", outputDir);
            } catch (error) {
                console.log(error)
                throw new InternalServerErrorException(error.message);
            }

            const masterFileUrl = await this.storageService.uploadHls(videoId, outputDir);

            if (!masterFileUrl) {
                throw new InternalServerErrorException("Internal Server Error while uploading files!");
            }

            try {
                await fs.rm(outputDir, { recursive: true, force: true });
                console.log(`Temporary HLS folder removed: ${outputDir}`);
            } catch (err) {
                console.warn(`Failed to remove temporary folder ${outputDir}:`, err);
            }

            const videoToSave = this.videoRepository.create({
                bucket: this.configService.get<string>("SUPABASE_BUCKET"),
                path: masterFileUrl,
                status: "READY",
                user: user,
                id: videoId
            })

            const video = await this.videoRepository.save(videoToSave);

            if (!video) {
                throw new InternalServerErrorException("Internal Server Error while saving file data in db!");
            }

            return {
                success: true,
                data: video,
                expired: false,
                message: "Video Uploaded Successful.",
                statusCode: 201
            }
        } catch (error: any) {
            return {
                success: false,
                data: null,
                expired: false,
                message: error.message,
                statusCode: error.status
            }
        }
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

        console.log(stream, "abcd")

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

        if(segment.includes(".ts")) {
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
}
