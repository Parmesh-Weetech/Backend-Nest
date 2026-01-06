import { Test, TestingModule } from '@nestjs/testing';
import { HCaptchaService } from './h-captcha.service';

describe('HCaptchaService', () => {
  let service: HCaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HCaptchaService],
    }).compile();

    service = module.get<HCaptchaService>(HCaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
