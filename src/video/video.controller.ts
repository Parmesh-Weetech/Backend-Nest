import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';

import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { APIResponse } from '../common/response/response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/entities/user.entity';

import { VideoService } from './video.service';
import { ConfigService } from '@nestjs/config';

@Controller('video')
export class VideoController {

    constructor(
        private readonly videoService: VideoService,
        private readonly configService: ConfigService
    ) { }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"), CurrentUserInterceptor)
    @Post("upload")
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.videoService.enqueue(file, user);
    }

    @UseGuards(AuthGuard)
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

    @UseGuards(AuthGuard)
    @Get(":videoId/:quality/index.m3u8")
    async findIndexFile(@Param("videoId") videoId: string, @Param("quality") quality: string, @Res() res: Response) {
        const { stream, filename } =
            await this.videoService.findIndexFile(videoId, quality);

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        stream.pipe(res);
    }

    @UseGuards(AuthGuard)
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

    @Get(":videoId")
    async getVideoById(@Param("videoId") videoId: string, @Headers("x-internal-secret") secret: string): Promise<APIResponse> {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        const video = await this.videoService.getVideoById(videoId);

        return {
            success: true,
            data: video,
            expired: false,
            message: "Video fetched successfully",
            statusCode: 200
        }
    }

    @Delete(":videoId")
    async deleteVideoById(@Param("videoId") videoId: string, @Headers("x-internal-secret") secret: string): Promise<void> {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        await this.videoService.deleteVideoById(videoId);
    }

    @Put(":videoId")
    async updateVideoStatus(@Param("videoId") videoId: string, @Body() body: { data: { status: "PENDING" | "PROCESSING" | "ACTIVE" | "FAILED", masterPath?: string, error?: string } }) {
        await this.videoService.updateVideoStatus(videoId, body.data.status, body.data.masterPath ?? undefined, body.data.error ?? undefined);
    }
}
