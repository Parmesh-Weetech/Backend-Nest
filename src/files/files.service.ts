import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './entities/File.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Files)
        private readonly fileRepository: Repository<Files>,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) { }

    async uploadFile(file: Express.Multer.File, user: User): Promise<string> {
        if (!file) throw new BadRequestException('File missing');

        if (file.size > 10 * 1024 * 1024) throw new BadRequestException("File size is too large.");

        const ext = file.originalname.split('.').pop();
        const path = `${user.id}/${randomUUID()}.${ext}`;

        const fileStream = Readable.from(file.buffer);

        await this.storageService.upload(path, fileStream, file.mimetype);

        try {
            const savedFile = await this.fileRepository.save({
                user: user,
                path,
                mimeType: file.mimetype,
                originalFileName: file.originalname,
                status: "ACTIVE",
                bucket: this.configService.get<string>('SUPABASE_BUCKET'),
            });

            return savedFile.id;
        } catch (error) {
            await this.storageService.deleteFile(path);
            throw new InternalServerErrorException('Failed to save file record');
        }
    }


    async listFiles(user: User) {
        const files = await this.fileRepository.find({ where: { user: user } });

        if (!files || files.length === 0) throw new NotFoundException("Files not found.");

        return await this.storageService.list(user.id);
    }

    async downloadFile(fileId: string) {
        const file = await this.fileRepository.findOne({ where: { id: fileId }, relations: ["user"] });

        if (!file) throw new NotFoundException('File not found');

        const stream = await this.storageService.download(file.path);

        return {
            stream,
            filename: file.path.split('/').pop(),
            contentType: 'application/octet-stream'
        };
    }

    async getSignedUrl(fileId: string) {
        const file = await this.fileRepository.findOne({ where: { id: fileId } });

        if (!file) throw new NotFoundException('File not found');

        return this.storageService.getSignedUrl(file.path);
    }

    async getFileById(fileId: string) {
        return await this.fileRepository.findOne({ where: { id: fileId }});
    }

    async getUploadSignedUrl(
        filename: string,
        type: string,
        user: User
    ) {
        if (!filename) {
            throw new BadRequestException('Filename is required');
        }

        const ext = filename.split('.').pop();
        const path = `${user.id}/${randomUUID()}.${ext}`;

        const { signedUrl } = await this.storageService.getSignedUploadUrl(path);

        const file = await this.fileRepository.save({
            user: user,
            path: path,
            status: "PENDING",
            originalFileName: filename,
            mimeType: type,
            bucket: this.configService.get<string>('SUPABASE_BUCKET'),
        });

        return {
            fileId: file.id,
            signedUrl,
        };
    }

    async confirmFileUpload(fileId: string) {
        const fileMetadata = await this.fileRepository.findOne({ where: { id: fileId }, relations: ['user'] });
        if (!fileMetadata) {
            return {
                confirm: false,
                message: "File not found in db!",
                status: 404
            }
        }

        const exists = await this.storageService.exists(fileMetadata.path);

        if (!exists) {
            fileMetadata.status = 'ORPHAN';
            await this.fileRepository.save(fileMetadata);

            return {
                confirm: false,
                message: "File not found in supabase!",
                status: 404
            };
        }

        fileMetadata.status = 'ACTIVE';

        try {
            const file = await this.fileRepository.save(fileMetadata);

            return {
                confirm: true,
                message: "File found in supabase.",
                status: 200
            };
        } catch (error: any) {
            return {
                confirm: false,
                message: error.message,
                status: error.status
            }
        }
    }

    async deleteFile(fileId: string, user: User): Promise<void> {
        const file = await this.fileRepository.findOne({
            where: { id: fileId },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        if (file.user.id !== user.id) {
            throw new ForbiddenException('Access denied');
        }

        // delete from storage first
        await this.storageService.deleteFile(file.path);

        // delete from DB
        await this.fileRepository.delete(file.id);
    }
}
