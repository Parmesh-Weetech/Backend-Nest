import { Module } from '@nestjs/common';
import { WebScrapingService } from './web-scraping.service';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  providers: [WebScrapingService],
  imports: [PdfModule]
})
export class WebScrapingModule {}
