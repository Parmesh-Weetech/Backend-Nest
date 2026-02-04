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
import { APIResponse } from '../common/response/response.dto';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';

import { FilesService } from './files.service';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
    constructor(
        private readonly fileService: FilesService
    ) { }

    @UseInterceptors(FileInterceptor('file') , CurrentUserInterceptor)
    @Post('upload')
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        return await this.fileService.uploadFile(file, user);
    }

    @Post('upload/signed-url')
    @UseInterceptors(CurrentUserInterceptor)
    async getUploadSignedUrl(
        @Body() fileData: { filename: string, type: string },
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        const data = await this.fileService.getUploadSignedUrl(
            fileData.filename,
            fileData.type,
            user
        );

        return {
            success: true,
            message: 'Upload signed URL generated',
            data,
            expired: false,
            statusCode: 200,
        };
    }

    @Post(":fileId/confirm")
    async confirmFileUpload(@Param("fileId") fileId: string): Promise<APIResponse> {
        const data = await this.fileService.confirmFileUpload(fileId);

        return {
            success: data.confirm,
            data: null,
            expired: false,
            message: data.message,
            statusCode: data.status
        }
    }

    @Get('list')
    @UseInterceptors(CurrentUserInterceptor)
    async listFiles(@CurrentUser() user: User) {
        const files = await this.fileService.listFiles(user);
        return { success: true, data: files, message: 'Files listed successfully' };
    }

    @Get('download/:fileId')
    async downloadFile(
        @Param('fileId') fileId: string,
        @Res({ passthrough: true }) res: response
    ) {
        const { stream, filename, contentType } = await this.fileService.downloadFile(fileId);

        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Type': contentType,
        });

        return new StreamableFile(stream);
    }

    @Get(':fileId/signed-url')
    async getSignedUrl(@Param('fileId') fileId: string): Promise<APIResponse> {
        const url = await this.fileService.getSignedUrl(fileId);

        return {
            success: true,
            message: 'Signed URL generated',
            data: url,
            expired: false,
            statusCode: 200
        };
    }

    @Delete(':id')
    @UseInterceptors(CurrentUserInterceptor)
    async deleteFile(
        @Param('id') fileId: string,
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        await this.fileService.deleteFile(fileId, user);

        return {
            success: true,
            message: 'File deleted successfully',
            data: null,
            expired: false,
            statusCode: 200
        };
    }
}
