import { Test, TestingModule } from '@nestjs/testing';
import { WebScrapingController } from './web-scraping.controller';

describe('WebScrapingController', () => {
  let controller: WebScrapingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebScrapingController],
    }).compile();

    controller = module.get<WebScrapingController>(WebScrapingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
