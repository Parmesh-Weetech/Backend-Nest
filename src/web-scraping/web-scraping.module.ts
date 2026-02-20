import { Module } from '@nestjs/common';
import { WebScrapingService } from './web-scraping.service';
import { WebScrapingController } from './web-scraping.controller';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeJob } from './entities/web-scraping.entity';

@Module({
  providers: [WebScrapingService],
  controllers: [WebScrapingController],
  imports: [BullModule.registerQueue({
    name: 'web-scraping',
    connection: {
      url: "redis://localhost:6379"
    }
  }), TypeOrmModule.forFeature([ScrapeJob])]
})
export class WebScrapingModule { }
