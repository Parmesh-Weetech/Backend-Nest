import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HCaptchaController } from './h-captcha.controller';
import { HCaptchaService } from './h-captcha.service';

@Module({
  controllers: [HCaptchaController],
  providers: [HCaptchaService],
  exports: [HCaptchaService],
  imports: [HttpModule]
})
export class HCaptchaModule {}
