import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

@Controller('video')
export class VideoController {

    constructor(private readonly videoService: VideoService) {}
    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
        return this.videoService.processVideo(file, user)
    }
}
