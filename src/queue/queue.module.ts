import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { NotificationService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';
// import { NotificationProcessor } from '../notification/notification.processor';
import { Notification } from '../notification/entities/notification.entity';
import { Video } from '../video/entities/video.entity';
import { VideoModule } from '../video/video.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { StorageModule } from '../storage/storage.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
    imports: [
        NotificationModule,
        VideoModule,
        FfmpegModule,
        StorageModule,
        PdfModule,
        TypeOrmModule.forFeature([Notification, Video]),
        BullModule.registerQueue({ name: 'notifications' }, { name: 'video-processing' }, { name: "pdf" }),
    ],
    providers: [NotificationService],
})
export class QueueModule { }
