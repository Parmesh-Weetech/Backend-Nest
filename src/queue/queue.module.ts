import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { NotificationProcessor } from '../notification/notification.processor';
import { Notification } from '../notification/entities/notification.entity';
import { VideoProcessor } from 'src/video/video.processor';
import { Video } from '../video/entities/video.entity';
import { FfmpegModule } from 'src/ffmpeg/ffmpeg.module';
import { StorageModule } from 'src/storage/storage.module';
import { VideoModule } from '../video/video.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, Video]),
        BullModule.registerQueue({ name: 'notifications' }, { name: 'video-processing' }),
        NotificationModule,
        FfmpegModule,
        StorageModule,
        VideoModule
    ],
    providers: [NotificationService, NotificationProcessor, VideoProcessor],
})
export class QueueModule {}
