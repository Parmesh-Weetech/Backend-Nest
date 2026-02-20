import { Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GeoService } from './geo.service';
import type { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { AutoUpdateService } from './autoUpdate.service';

@Controller('ip')
export class GeoController {
    constructor(
        private readonly geoService: GeoService,
        private readonly autoUpdateService: AutoUpdateService
    ) {}

    @Get()
    getIpInfo(@Req() req: Request) {
        const ip = '116.72.16.18';

        if(!ip) throw new UnauthorizedException({ message: "Unauthorized request"});

        return this.geoService.getFullGeo(ip);
    }

    @UseGuards(AuthGuard)
    @Post()
    async updateMMDBFile() {
        await this.autoUpdateService.update()
    }
}
