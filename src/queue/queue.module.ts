import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { NotificationModule } from '../notification/notification.module';
import { NotificationProcessor } from '../notification/notification.processor';
import { VideoProcessor } from '../video/video.processor';
import { VideoModule } from '../video/video.module';
import { FfmpegModule } from '../ffmpeg/ffmpeg.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        NotificationModule,
        VideoModule,
        FfmpegModule,
        StorageModule,
        BullModule.registerQueue({ name: 'notifications' }, { name: 'video-processing' }),
    ],
    providers: [NotificationProcessor, VideoProcessor],
})
export class QueueModule {}
