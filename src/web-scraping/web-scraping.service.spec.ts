import { Test, TestingModule } from '@nestjs/testing';
import { WebScrapingService } from './web-scraping.service';

describe('WebScrapingService', () => {
  let service: WebScrapingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebScrapingService],
    }).compile();

    service = module.get<WebScrapingService>(WebScrapingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
