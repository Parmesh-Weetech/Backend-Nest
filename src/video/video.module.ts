import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { StorageModule } from '../storage/storage.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { Video } from './entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
  imports: [StorageModule, FfmpegModule, TypeOrmModule.forFeature([Video])]
})
export class VideoModule {}
