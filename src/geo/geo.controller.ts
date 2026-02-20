import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { GeoService } from './geo.service';
import type { Request } from 'express';

@Controller('ip')
export class GeoController {
    constructor(private readonly geoService: GeoService) {}

    @Get()
    getIpInfo(@Req() req: Request) {
        const ip = '116.72.16.18';

        if(!ip) throw new UnauthorizedException({ message: "Unauthorized request"});

        return this.geoService.getFullGeo(ip);
    }
}
