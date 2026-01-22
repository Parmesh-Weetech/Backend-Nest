import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { Response } from '../common/response/response.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class SupabaseService {
    private readonly client: SupabaseClient;

    constructor(
        private readonly config: ConfigService,
        @Inject(forwardRef(() => FilesService))
        private readonly fileService: FilesService
    ) {
        this.client = createClient(
            this.config.get<string>('SUPABASE_URL')!,
            this.config.get<string>('SUPABASE_SERVICE_KEY')!,
        );
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    async uploadFile(file: Express.Multer.File, user: User): Promise<Response> {
        try {
            if (!file) {
                throw new Error('No file received. Make sure form-data key is "file".');
            }

            if (!file.originalname) {
                throw new BadRequestException('Invalid file metadata');
            }

            if (file.size > 2 * 1024 * 1024) {
                throw new BadRequestException('File too large');
            }

            if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
                throw new BadRequestException('Invalid file type');
            }

            const bucket = this.config.get<string>('SUPABASE_BUCKET')!;

            const fileExt = file.originalname.split('.').pop();
            const fileName = `${randomUUID()}.${fileExt}`;
            const folder = user.id
            const filePath = `${folder}/${fileName}`;

            const { error } = await this
                .getClient()
                .storage
                .from(bucket)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (error) {
                throw new InternalServerErrorException(error.message);
            }

            const saveInDB = this.fileService.save(user.id, bucket, filePath);

            if (!saveInDB) {
                const deleteFile = await this.deleteFile(filePath);

                return {
                    success: false,
                    expired: false,
                    message: "Error while saving file",
                    data: null,
                    statusCode: 500
                }
            }

            const signedUrl = await this.getSignedUrl(filePath);

            return {
                success: true,
                expired: false,
                message: "Image uploaded successfully.",
                statusCode: 201,
                data: signedUrl
            };
        } catch (error: any) {
            return {
                success: false,
                expired: false,
                message: error.message,
                data: null,
                statusCode: error.status
            }
        }
    }

    async getSignedUrl(path: string, expiresIn = 60 * 60 * 24) {
        const { data, error } = await this
            .getClient()
            .storage
            .from('uploads')
            .createSignedUrl(path, expiresIn);

        if (error) throw error;

        return data.signedUrl;
    }

    async deleteFile(path: string) {
        const { error } = await this
            .getClient()
            .storage
            .from('uploads')
            .remove([path]);

        if (error) throw error;
    }

}
