import { Body, Controller, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { Readable } from 'stream';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';

@Controller('storage')
export class StorageController {
    constructor(
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) { }
    @Post("/upload")
    async uploadFile(@Body() body: { data: { path: string, stream: Readable, mimeType: string } }, @Headers("x-internal-secret") secret: string): Promise<void> {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        await this.storageService.upload(body.data.path, body.data.stream, body.data.mimeType);
    }

    @Post(":videoId")
    async uploadHls(@Param("videoId") videoId: string, @Body() body: { data: { path: string } }, @Headers("x-internal-secret") secret: string) {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        await this.storageService.uploadHls(videoId, body.data.path);
    }
}
