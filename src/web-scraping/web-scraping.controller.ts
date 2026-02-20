import { Body, Controller, Headers, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { WebScrapingService } from './web-scraping.service';
import type { Request } from 'express';
import { ScrapeStatus } from './entities/web-scraping.entity';
import { ConfigService } from '@nestjs/config';

@Controller('web-scraping')
export class WebScrapingController {
    constructor(
        private readonly webScrapingService: WebScrapingService,
        private readonly configService: ConfigService
    ) {

    }
    @Post()
    async startCrawl(@Body() body: { url: string }, @Req() req: Request) {
        return this.webScrapingService.start(body.url, req)
    }

    @Put()
    async updateStatus(@Body() body: { jobId: string, url: string, mainUrl: string, status: ScrapeStatus }, @Headers("x-internal-secret") secret: string) {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        await this.webScrapingService.updateStatus(body.jobId, body.url, body.mainUrl, body.status);
    }
}
