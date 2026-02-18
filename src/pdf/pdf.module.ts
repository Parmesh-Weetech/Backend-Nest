import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { PdfService } from './pdf.service';
import { BrowserService } from './browser.service';
import { HttpModule } from '@nestjs/axios';
import { PdfProcessor } from './pdf.processor';

@Module({
  providers: [PdfService, BrowserService],
  exports: [PdfService],
  imports: [
    BullModule.registerQueue({
      name: 'pdf',
      connection: {
        url: "redis://localhost:6379"
      }
    }),
    HttpModule
  ],
})
export class PdfModule { }
