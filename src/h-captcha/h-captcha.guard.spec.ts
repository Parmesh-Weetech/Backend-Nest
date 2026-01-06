import { HCaptchaGuard } from '../common/guards/h-captcha.guard';

describe('HCaptchaGuard', () => {
  it('should be defined', () => {
    expect(new HCaptchaGuard()).toBeDefined();
  });
});
