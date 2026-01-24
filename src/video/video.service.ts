import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/entities/user.entity';
import { Readable } from 'stream';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';

@Injectable()
export class VideoService {
    constructor(
        private readonly storageService: StorageService,
        private readonly ffmpegService: FfmpegService
    ) {}
    async processVideo(file: Express.Multer.File, user: User) {
        const videoId = randomUUID();

        const ext = file.originalname.split('.').pop();
        const originalFilePath = `videos/${videoId}/original.${ext}`;
        const segmentFilePath = `videos/${videoId}/{360p,480p,720p}/*.ts`;

        const fileStream = Readable.from(file.buffer);

        await this.storageService.upload(originalFilePath, fileStream, file.mimetype);

        const signedUrl = await this.storageService.getSignedUrl(originalFilePath, 86400);

        const outputDir = `/tmp/hls/${videoId}`;
        await this.ffmpegService.generateHls(segmentFilePath, outputDir);
    }
}
