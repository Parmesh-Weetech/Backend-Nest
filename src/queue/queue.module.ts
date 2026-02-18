import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { PdfModule } from '../pdf/pdf.module';
import { PdfProcessor } from '../pdf/pdf.processor';

@Module({
    imports: [
        PdfModule,
        BullModule.registerQueue({ name: "pdf" }),
    ],
    providers: [PdfProcessor],
})
export class QueueModule { }
