import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { HCaptchaService } from '../../h-captcha/h-captcha.service';

@Injectable()
export class HcaptchaGuard implements CanActivate {
  constructor(private readonly hcaptchaService: HCaptchaService) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.method === 'OPTIONS') {
      return true;
    }

    const token = req.body?.hcaptchaToken;

    if (!token) throw new BadRequestException('hCaptcha required');

    await this.hcaptchaService.verify(token, req.ip);

    return true;
  }
}
