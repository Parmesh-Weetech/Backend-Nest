import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [],
    exports: [],
    imports: [
        BullModule.registerQueue({
            name: 'notifications',
            connection: {
                url: "redis://localhost:6379"
            }
        }),
        HttpModule
    ],
})
export class NotificationModule { }
