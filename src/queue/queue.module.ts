import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { NotificationProcessor } from '../notification/notification.processor';
import { Notification } from '../notification/entities/notification.entity';
import { VideoProcessor } from '../video/video.processor';
import { Video } from '../video/entities/video.entity';
import { VideoModule } from '../video/video.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        NotificationModule,
        VideoModule,
        FfmpegModule,
        StorageModule,
        TypeOrmModule.forFeature([Notification, Video]),
        BullModule.registerQueue({ name: 'notifications' }, { name: 'video-processing' }),
    ],
    providers: [NotificationService, NotificationProcessor, VideoProcessor],
})
export class QueueModule {}
