import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';

import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { AuthGuard } from '../common/guards/auth.guard';

import { VideoService } from './video.service';
import { APIResponse } from '../common/response/response.dto';

@Controller('video')
@UseGuards(AuthGuard, CurrentUserGuard)
export class VideoController {

    constructor(
        private readonly videoService: VideoService
    ) { }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseInterceptors(FileInterceptor("file"), CurrentUserInterceptor)
    @Post("upload")
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.videoService.enqueue(file, user);
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
