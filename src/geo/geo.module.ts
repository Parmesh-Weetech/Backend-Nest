import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';
import { AutoUpdateService } from './autoUpdate.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [GeoService, AutoUpdateService],
  exports: [GeoService],
  controllers: [GeoController],
  imports: [AuthModule]
})
export class GeoModule {}
