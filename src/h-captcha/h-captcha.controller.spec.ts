import { Test, TestingModule } from '@nestjs/testing';
import { HCaptchaController } from './h-captcha.controller';

describe('HCaptchaController', () => {
  let controller: HCaptchaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HCaptchaController],
    }).compile();

    controller = module.get<HCaptchaController>(HCaptchaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
