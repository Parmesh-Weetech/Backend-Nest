import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response as response } from 'express'

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { APIResponse } from '../common/response/response.dto';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';

import { FilesService } from './files.service';

@UseGuards(AuthGuard, CurrentUserGuard)
@Controller('files')
export class FilesController {
    constructor(
        private readonly fileService: FilesService
    ) { }

    @UseInterceptors(FileInterceptor('file'), CurrentUserInterceptor)
    @Post('upload')
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        return await this.fileService.uploadFile(file, user);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Post('upload/signed-url')
    async createSignedUploadUrl(
        @Body() fileData: { filename: string, type: string },
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        return await this.fileService.createSignedUploadUrl(
            fileData.filename,
            fileData.type,
            user
        );
    }

    @Post(":fileId/confirm")
    async confirmFileUpload(@Param("fileId") fileId: string): Promise<APIResponse> {
        return await this.fileService.confirmFileUpload(fileId);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Get('list')
    async listFiles(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.fileService.listFiles(user);
    }

    @Get('download/:fileId')
    async downloadFile(
        @Param('fileId') fileId: string,
        @Res({ passthrough: true }) res: response
    ) {
        const response = await this.fileService.downloadFile(fileId);

        res.set({
            'Content-Disposition': `attachment; filename="${response.data.filename}"`,
            'Content-Type': response.data.contentType,
        });

        return new StreamableFile(response.data.stream);
    }

    @Get(':fileId/signed-url')
    async getSignedUrl(@Param('fileId') fileId: string): Promise<APIResponse> {
        return await this.fileService.getSignedUrl(fileId);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Delete(':id')
    async deleteFile(
        @Param('id') fileId: string,
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        return  await this.fileService.deleteFile(fileId, user);
    }
}
