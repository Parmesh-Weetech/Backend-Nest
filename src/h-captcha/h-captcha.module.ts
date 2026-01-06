import { Module } from '@nestjs/common';
import { HCaptchaController } from './h-captcha.controller';
import { HCaptchaService } from './h-captcha.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [HCaptchaController],
  providers: [HCaptchaService],
  exports: [HCaptchaService],
  imports: [HttpModule]
})
export class HCaptchaModule {}
