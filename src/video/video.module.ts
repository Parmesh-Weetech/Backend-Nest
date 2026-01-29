import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { StorageModule } from '../storage/storage.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { Video } from './entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { VideoSseService } from './videoSse.service';
import { VideoSseController } from './videoSse.controller';

@Module({
  providers: [VideoService, VideoSseService],
  controllers: [VideoController, VideoSseController],
  imports: [StorageModule, FfmpegModule, AuthModule, UserModule, TypeOrmModule.forFeature([Video]), BullModule.registerQueue({
    name: 'video-processing',
    connection: {
      url: "redis://localhost:6379"
    }
  })],
  exports: [VideoSseService]
})
export class VideoModule { }
