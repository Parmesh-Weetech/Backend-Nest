import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { PdfModule } from '../pdf/pdf.module';
import { PdfProcessor } from '../pdf/pdf.processor';
import { NotificationProcessor } from '../notifications/notification.processor';
import { VideoProcessor } from '../video/video.processor';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';

@Module({
    imports: [
        PdfModule,
        FfmpegModule,
        BullModule.registerQueue({ name: "pdf" }, { name: "notifications" }, { name: "video-processing" }),
    ],
    providers: [PdfProcessor, NotificationProcessor, VideoProcessor],
})
export class QueueModule { }
