import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { StorageModule } from '../storage/storage.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
  imports: [StorageModule, FfmpegModule]
})
export class VideoModule {}
