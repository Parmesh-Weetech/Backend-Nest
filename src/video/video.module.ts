import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
    providers: [],
    exports: [],
    imports: [
        BullModule.registerQueue({
            name: 'video-processing',
            connection: {
                url: "redis://localhost:6379"
            }
        })
    ],
})
export class VideoModule {}
