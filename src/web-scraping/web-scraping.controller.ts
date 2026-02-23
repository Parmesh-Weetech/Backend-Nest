import { Body, Controller, Get, Headers, Param, Post, Put, Query, Req, UnauthorizedException } from '@nestjs/common';
import { WebScrapingService } from './web-scraping.service';
import type { Request } from 'express';
import { ScrapeStatus } from './entities/web-scraping.entity';
import { ConfigService } from '@nestjs/config';
import { APIResponse } from '../common/response/response.dto';

@Controller('web-scraping')
export class WebScrapingController {
    constructor(
        private readonly webScrapingService: WebScrapingService,
        private readonly configService: ConfigService
    ) {

    }
    @Post()
    async startCrawl(@Body() body: { url: string }) {
        return this.webScrapingService.start(body.url)
    }

    @Put(":id")
    async updateStatus(@Body() body: { subUrl: string, mainUrl: string, url: string, status: ScrapeStatus }, @Param("id") id: string, @Headers("x-internal-secret") secret: string) {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        await this.webScrapingService.updateStatus(id, body.subUrl, body.mainUrl, body.status);
    }

    @Post("add")
    async findAndAddLinks(@Body() body: any, @Headers("x-internal-secret") secret: string) {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });
        
        await this.webScrapingService.findAndAddLinks(body.newSubUrl, body.mainUrl, body.link);
    }

    @Get()
    async findById(@Query("mainUrl") mainUrl: string, @Query("subUrl") subUrl: string, @Headers("x-internal-secret") secret: string): Promise<APIResponse> {
        const secret_code = await this.configService.get("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized request!" });

        return await this.webScrapingService.findById(mainUrl, subUrl);
    }
}