import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './entities/File.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '@nestjs/config';

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
        if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type');
        }

        const ext = file.originalname.substring(
            file.originalname.lastIndexOf('.') + 1,
        );
        const path = `${user.id}/${randomUUID()}.${ext}`;

        await this.storageService.upload(path, file.buffer, file.mimetype);

        try {
            await this.fileRepository.save({
                user_id: user.id,
                path,
                bucket: this.configService.get<string>("SUPABASE_BUCKET")
            });
        } catch (error: any) {
            await this.storageService.deleteFile(path);
            throw new InternalServerErrorException('Failed to save file');
        }

        return this.storageService.getSignedUrl(path);
    }

    async listFiles(user: User) {
        const files = await this.fileRepository.find({ where: { user_id: user.id } });

        if(!files || files.length === 0) throw new NotFoundException("Files not found.");

        return await this.storageService.list(user.id);
    }

    async downloadFile(fileId: string, user: User) {
        const file = await this.fileRepository.findOne({ where: { id: fileId } });

        if (!file) throw new NotFoundException('File not found');
        if (file.user_id !== user.id) throw new ForbiddenException('Access denied');

        const stream = await this.storageService.download(file.path);

        return {
            stream,
            filename: file.path.split('/').pop(),
            contentType: 'application/octet-stream'
        };
    }

    async getSignedUrl(fileId: string, user: User) {
        const file = await this.fileRepository.findOne({ where: { id: fileId } });

        if (!file) throw new NotFoundException('File not found');
        if (file.user_id !== user.id) throw new ForbiddenException("Invalid request");

        return this.storageService.getSignedUrl(file.path);
    }


    async deleteFile(fileId: string, user: User): Promise<void> {
        const file = await this.fileRepository.findOne({
            where: { id: fileId },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        if (file.user_id !== user.id) {
            throw new ForbiddenException('Access denied');
        }

        // delete from storage first
        await this.storageService.deleteFile(file.path);

        // delete from DB
        await this.fileRepository.delete(file.id);
    }
}
