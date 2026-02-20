import { Module } from '@nestjs/common';
import { AutoUpdateMaxmindFile } from './auth.update.service';

@Module({
    providers: [AutoUpdateMaxmindFile]
})
export class GeoLocationModule {}
