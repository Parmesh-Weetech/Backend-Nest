import { Body, Controller, Delete, Get, Param, Post, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from '../common/response/response.dto';
import type { Response as response } from 'express'

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(
        private readonly fileService: FilesService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: User
    ): Promise<Response> {
        const fileId = await this.fileService.uploadFile(file, user);

        return {
            success: true,
            message: 'File uploaded successfully',
            data: fileId,
            expired: false,
            statusCode: 201
        };
    }

    @Post('upload/signed-url')
    async getUploadSignedUrl(
        @Body() fileData: { filename: string, type: string },
        @CurrentUser() user: User
    ): Promise<Response> {
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
    async confirmFileUpload(@Param("fileId") fileId: string): Promise<Response> {
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

    @Get(':id/signed-url')
    async getSignedUrl(@Param('id') id: string, @CurrentUser() user: User): Promise<Response> {
        const url = await this.fileService.getSignedUrl(id, user);

        return {
            success: true,
            message: 'Signed URL generated',
            data: url,
            expired: false,
            statusCode: 200
        };
    }

    @Delete(':id')
    async deleteFile(
        @Param('id') fileId: string,
        @CurrentUser() user: User
    ): Promise<Response> {
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
