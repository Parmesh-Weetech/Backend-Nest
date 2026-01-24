import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
  providers: [VideoService],
  controllers: [VideoController]
})
export class VideoModule {}
