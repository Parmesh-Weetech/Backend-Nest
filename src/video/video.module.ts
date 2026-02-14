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

const databaseProvider = process.env.DATABASE_PROVIDER?.toLowerCase();
const isPostgres = databaseProvider === 'postgres';
const isMongo = databaseProvider === 'mongo' || databaseProvider === 'mongodb';
const VideoRepositoryProvider = {
  provide: VIDEO_REPOSITORY,
  useClass: isPostgres
    ? require('./postgres-video.repository').PostgresVideoRepository
    : require('./mongo-video.repository').MongoVideoRepository,
};

@Module({
  providers: [
    VideoService,
    VideoSseService,
    VideoRepositoryProvider,
  ],
  controllers: [VideoController, VideoSseController],
  imports: [StorageModule, FfmpegModule, AuthModule, UserModule, ...(isPostgres
    ? [TypeOrmModule.forFeature([Video])]
    : []),

    ...(isMongo
      ? [
        MongooseModule.forFeature([
          { name: VideoDocument.name, schema: VideoSchema },
        ]),
      ]
      : []), BullModule.registerQueue({
        name: 'video-processing',
        connection: {
          url: "redis://localhost:6379"
        }
      })],
  exports: [VideoSseService, VideoService, VIDEO_REPOSITORY]
})
export class VideoModule { }
