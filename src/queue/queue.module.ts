import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { PdfModule } from '../pdf/pdf.module';
import { PdfProcessor } from '../pdf/pdf.processor';
import { NotificationProcessor } from '../notifications/notification.processor';
import { VideoProcessor } from '../video/video.processor';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { WebScrapingProcessor } from 'src/web-scraping/web-scraping.processor';
import { WebScrapingModule } from 'src/web-scraping/web-scraping.module';

@Module({
    imports: [
        PdfModule,
        FfmpegModule,
        WebScrapingModule,
        BullModule.registerQueue({ name: "pdf" }, { name: "notifications" }, { name: "video-processing" }, { name: 'web-scraping' }),
    ],
    providers: [PdfProcessor, NotificationProcessor, VideoProcessor, WebScrapingProcessor],
})
export class QueueModule { }
