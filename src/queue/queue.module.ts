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
import { WebScrapingModule } from 'src/web-scraping/web-scraping.module';

@Module({
    imports: [
        NotificationModule,
        VideoModule,
        FfmpegModule,
        StorageModule,
        PdfModule,
        WebScrapingModule,
        TypeOrmModule.forFeature([Notification, Video]),
        BullModule.registerQueue({ name: 'notifications' }, { name: 'video-processing' }, { name: "pdf" }, { name: 'web-scraping' }),
    ],
    providers: [NotificationService],
})
export class QueueModule { }
