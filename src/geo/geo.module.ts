import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [GeoService],
  exports: [GeoService],
  controllers: [GeoController],
  imports: [AuthModule]
})
export class GeoModule {}
