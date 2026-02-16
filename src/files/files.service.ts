import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { StorageService } from '../storage/storage.service';

import { Files } from './entities/File.entity';
import { FILES_REPOSITORY, type IFilesRepository } from './files.repository.interface';

@Injectable()
export class FilesService {
    constructor(
        @Inject(FILES_REPOSITORY)
        private readonly fileRepository: IFilesRepository,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) { }

    async uploadFile(file: Express.Multer.File, user: User): Promise<APIResponse> {
        if (!file) throw new BadRequestException('File missing');

        if (file.size > 10 * 1024 * 1024) throw new BadRequestException("File size is too large.");

        const ext = file.originalname.split('.').pop();
        const path = `${user.id}/${randomUUID()}.${ext}`;

        const fileStream = Readable.from(file.buffer);

        await this.storageService.upload(path, fileStream, file.mimetype);

        try {
            const savedFile = await this.fileRepository.create({
                user: user,
                path,
                mimeType: file.mimetype,
                originalFileName: file.originalname,
                status: "ACTIVE",
                bucket: this.configService.get<string>('SUPABASE_BUCKET'),
            });

            return {
                data: {
                    id: savedFile.id,
                    name: savedFile.originalFileName,
                    mimeType: savedFile.mimeType,
                    bucket: savedFile.bucket,
                    status: savedFile.status
                },
                success: true,
                expired: false,
                message: "File Uploaded Successfully.",
                statusCode: 201
            }
        } catch (error) {
            await this.storageService.deleteFile(path);
            throw new InternalServerErrorException('Failed to save file record');
        }
    }


    async listFiles(user: User): Promise<APIResponse> {
        const files = await this.fileRepository.findByUser(user.id);

        if (!files || files.length === 0) throw new NotFoundException("Files not found.");

        const response = files.map(file => ({
            id: file.id,
            originalFileName: file.originalFileName,
            mimeType: file.mimeType,
            status: file.status,
            bucket: file.bucket,
            user: file.user ? { id: file.user.id, } : null,
            created_at: file.created_at,
            updated_at: file.updated_at,
        }));

        return {
            data: response,
            success: true,
            message: "Files retrieved successfully.",
            statusCode: 200,
            expired: false
        };
    }

    async downloadFile(fileId: string): Promise<APIResponse> {
        const file = await this.fileRepository.findByIdWithUser(fileId);
        if (!file) throw new NotFoundException('File not found');

        if (file.status !== 'ACTIVE') {
            throw new ForbiddenException('File is not available for download');
        }

        const stream = await this.storageService.download(file.path);

        return {
            data: {
                stream,
                filename: file.path.split('/').pop(),
                contentType: 'application/octet-stream'
            },
            success: true,
            message: "File download prepared successfully.",
            statusCode: 200,
            expired: false
        };
    }

    async getSignedUrl(fileId: string): Promise<APIResponse> {
        const file = await this.fileRepository.findById(fileId);
        if (!file) throw new NotFoundException('File not found');

        const response = await this.storageService.getSignedUrl(file.path);

        return {
            data: response,
            success: true,
            message: "Signed URL generated successfully.",
            statusCode: 200,
            expired: false
        };
    }

    async getFileById(fileId: string) {
        return await this.fileRepository.findById(fileId);
    }

    async createSignedUploadUrl(
        filename: string,
        type: string,
        user: User
    ): Promise<APIResponse> {
        if (!filename) throw new BadRequestException('Filename is required');

        const ext = filename.split('.').pop();
        const path = `${user.id}/${randomUUID()}.${ext}`;

        const { signedUrl } = await this.storageService.createSignedUploadUrl(path);

        const file = await this.fileRepository.create({
            user: user,
            path: path,
            status: "PENDING",
            originalFileName: filename,
            mimeType: type,
            bucket: this.configService.get<string>('SUPABASE_BUCKET'),
        });

        return {
            data: {
                signedUrl: signedUrl,
                fileId: file.id,
            },
            success: true,
            expired: false,
            message: "Signed upload URL created successfully.",
            statusCode: 201
        };
    }

    async confirmFileUpload(fileId: string): Promise<APIResponse> {
        const fileMetadata = await this.fileRepository.findByIdWithUser(fileId);
        if (!fileMetadata) throw new NotFoundException('File metadata not found');

        const exists = await this.storageService.exists(fileMetadata.path);
        if (!exists) {
            fileMetadata.status = 'ORPHAN';
            await this.fileRepository.update(fileId, fileMetadata);

            throw new NotFoundException('File not found in storage');
        }

        fileMetadata.status = 'ACTIVE';

        const file = await this.fileRepository.update(fileId, fileMetadata);
        if (!file) {
            throw new InternalServerErrorException('Failed to update file status');
        }

        return {
            success: true,
            data: null,
            message: "File found in supabase.",
            statusCode: 200,
            expired: false
        };
    }

    async deleteFile(fileId: string, user: User): Promise<APIResponse> {
        const file = await this.fileRepository.findById(fileId);

        if (!file) {
            throw new NotFoundException('File not found');
        }

        if (file.user.id !== user.id) {
            throw new ForbiddenException('Access denied');
        }

        const storageResponse = await this.storageService.deleteFile(file.path);

        if (storageResponse === false) {
            throw new InternalServerErrorException('Failed to delete file from storage');
        }

        const databaseResponse = await this.fileRepository.delete(file.id);

        if (!databaseResponse) {
            throw new InternalServerErrorException('Failed to delete file record from database');
        }

        return {
            success: true,
            message: 'File deleted successfully',
            data: null,
            expired: false,
            statusCode: 200
        }
    }
}
