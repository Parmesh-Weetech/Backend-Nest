import { Body, Controller, Get, Param, Post, Res, Sse, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import type { Response } from 'express';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { Subject } from 'rxjs';
import { VideoSseService } from './videoSse.service';

@Controller('video')
export class VideoController {

    constructor(
        private readonly videoService: VideoService,
        private readonly videoSseService: VideoSseService
    ) {}

    private videoEvents = new Subject<MessageEvent>();

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @UseInterceptors(CurrentUserInterceptor)
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
        const result = await this.videoService.enqueue(file, user);

        if(result.success) {
            this.videoSseService.sendSuccess(result.data.id, "ACTIVE", "");
        } else {
            this.videoSseService.sendError(result.data.id, "Job Failed", "FAILED");
        }

        return result;
    }

    @Get(":videoId/master.m3u8")
    async findMasterFile(@Param("videoId") videoId: string, @Res() res: Response) {
        const { stream, filename } =
            await this.videoService.findMasterFile(videoId);

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${filename}"`,
        );

        stream.pipe(res);
    }

    @Get(":videoId/:quality/index.m3u8")
    async findIndexFile(@Param("videoId") videoId: string, @Param("quality") quality: string, @Res() res: Response) {
        const { stream, filename } =
            await this.videoService.findIndexFile(videoId, quality);

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        stream.pipe(res);
    }

    @Get(':videoId/:quality/:segment')
    async getSegment(
        @Param('videoId') videoId: string,
        @Param('quality') quality: string,
        @Param('segment') segment: string,
        @Res() res: Response,
    ) {
        const { stream, filename } =
            await this.videoService.findSegment(videoId, quality, segment);

        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        stream.pipe(res);
    }
}
