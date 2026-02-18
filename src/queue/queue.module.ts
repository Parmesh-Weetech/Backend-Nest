import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { PdfModule } from '../pdf/pdf.module';
import { PdfProcessor } from '../pdf/pdf.processor';
import { NotificationProcessor } from '../notifications/notification.processor';

@Module({
    imports: [
        PdfModule,
        BullModule.registerQueue({ name: "pdf" }, { name: "notifications" }),
    ],
    providers: [PdfProcessor, NotificationProcessor],
})
export class QueueModule { }
