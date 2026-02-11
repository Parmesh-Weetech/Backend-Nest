import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { StorageModule } from '../storage/storage.module';

import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './entities/video.entity';
import { VideoSseService } from './videoSse.service';
import { VideoSseController } from './videoSse.controller';
import { VideoRepository } from './video.repository';

@Module({
  providers: [VideoService, VideoSseService, VideoRepository],
  controllers: [VideoController, VideoSseController],
  imports: [StorageModule, FfmpegModule, AuthModule, UserModule, TypeOrmModule.forFeature([VideoRepository]), BullModule.registerQueue({
    name: 'video-processing',
    connection: {
      url: "redis://localhost:6379"
    }
  })],
  exports: [VideoSseService, VideoService]
})
export class VideoModule { }
