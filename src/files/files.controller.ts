import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from '../common/response/response.dto';

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
        const signedUrl = await this.fileService.uploadFile(file, user);

        return {
            success: true,
            message: 'File uploaded successfully',
            data: signedUrl,
            expired: false,
            statusCode: 201
        };
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
