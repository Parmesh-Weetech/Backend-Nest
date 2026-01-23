import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
    private readonly client: SupabaseClient;
    private readonly bucket: string;

    constructor(private readonly config: ConfigService) {
        this.client = createClient(
            config.get('SUPABASE_URL')!,
            config.get('SUPABASE_SERVICE_KEY')!,
        );

        this.bucket = config.get<string>('SUPABASE_BUCKET')!;
    }

    async upload(path: string, buffer: Buffer, mimeType: string): Promise<void> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .upload(path, buffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) throw new InternalServerErrorException(error.message);
    }

    async download(path: string): Promise<Readable> {
        const { data, error } = await this.client.storage.from(this.bucket).download(path);

        if (error) throw new InternalServerErrorException(error.message);

        const arrayBuffer = await data.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        return Readable.from(buffer);
    }

    async list(path: string = ''): Promise<string[]> {
        const { data, error } = await this.client.storage.from(this.bucket).list(path);
        if (error) throw new InternalServerErrorException(error.message);

        // return only file names
        return data.map(file => file.name);
    }

    async getSignedUrl(path: string, expiresIn = 86400): Promise<string> {
        const { data, error } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(path, expiresIn);

        if (error) throw new InternalServerErrorException(error.message);
        return data.signedUrl;
    }

    async deleteFile(path: string): Promise<void> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .remove([path]);

        if (error) throw new InternalServerErrorException(error.message);
    }
}
