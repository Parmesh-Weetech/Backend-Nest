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
import { MongooseModule } from '@nestjs/mongoose';
import { VideoDocument, VideoSchema } from './schemas/video.schema';
import { VIDEO_REPOSITORY } from './video.interface.repository';
import { PostgresVideoRepository } from './postgres-video.repository';
import { MongoVideoRepository } from './mongo-video.repository';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  providers: [
    VideoService,
    VideoSseService,
    PostgresVideoRepository,
    MongoVideoRepository,
    createDatabaseRepositoryProvider(
      VIDEO_REPOSITORY,
      PostgresVideoRepository,
      MongoVideoRepository,
    ),
  ],
  controllers: [VideoController, VideoSseController],
  imports: [
    StorageModule,
    FfmpegModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Video]),
    MongooseModule.forFeature([
      { name: VideoDocument.name, schema: VideoSchema },
    ]),
    BullModule.registerQueue({
        name: 'video-processing',
        connection: {
          url: "redis://localhost:6379"
        }
      }),
  ],
  exports: [VideoSseService, VideoService, VIDEO_REPOSITORY]
})
export class VideoModule { }
