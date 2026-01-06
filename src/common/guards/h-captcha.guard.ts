import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HCaptchaService } from '../../h-captcha/h-captcha.service.js';

@Injectable()
export class HcaptchaGuard implements CanActivate {
  constructor(private readonly hcaptchaService: HCaptchaService) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.body?.hcaptchaToken;

    if (!token) {
      throw new UnauthorizedException('hCaptcha required');
    }

    const res = await this.hcaptchaService.verify(token, req.ip);

    return true;
  }
}
