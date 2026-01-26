import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
            await this.ffmpegService.generateHls("assets/video/30902-383991325_small.mp4", outputDir);

            const masterFileUrl = await this.storageService.uploadHls(videoId, outputDir);

            if (!masterFileUrl) {
                throw new InternalServerErrorException("Internal Server Error while uploading files!");
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
}
