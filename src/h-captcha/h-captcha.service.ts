import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HCaptchaService {
    constructor(private readonly httpService: HttpService, private readonly configureService: ConfigService) { }

    async verify(token: string, ip?: string): Promise<void> {
        if (!token) {
            throw new UnauthorizedException('hCaptcha token missing');
        }

        const res = await firstValueFrom(
            this.httpService.post(
                this.configureService.get<string>('HCAPTCHA_VERIFY_URL')!,
                {
                    secret: this.configureService.get<string>('HCAPTCHA_SECRET_KEY'),
                    response: token,
                    remoteip: ip,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ),
        );

        if (!res.data.success) {
            throw new UnauthorizedException('hCaptcha verification failed');
        }
    }
}
