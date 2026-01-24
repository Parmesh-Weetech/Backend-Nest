import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {

    constructor(private readonly videoService: VideoService) {}
    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file: Express.Multer.File) {
        return this.videoService.processVideo(file)
    }
}
