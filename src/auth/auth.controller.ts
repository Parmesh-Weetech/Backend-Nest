import {
    Body,
    Controller,
    Headers,
    Post,
    Res,
    UseGuards
} from '@nestjs/common';
import type { Response } from 'express';

import { Public } from '../common/decorators/public.decorator';
import { HcaptchaGuard } from '../common/guards/h-captcha.guard';
import { APIResponse } from '../common/response/response.dto';
import { AuthGuard } from '../common/guards/auth.guard';

import { User } from '../user/entities/user.entity';
import { Serialize } from './interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignupDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Serialize(User)
    @Post("/signup")
    async signup(@Body() signupDTO: SignupDTO): Promise<APIResponse> {
        return await this.authService.signup(signupDTO);
    }

    @Public()
    @UseGuards(HcaptchaGuard)
    @Post('/login')
    async login(@Body() loginDTO: LoginDTO): Promise<APIResponse> {
        const response = await this.authService.login(loginDTO);

        return {
            success: response.success,
            message: response.message,
            statusCode: response.statusCode,
            data: {
                access_token: response.access_token,
                refresh_token: response.refresh_token
            },
            expired: false
        }
    }

    @UseGuards(AuthGuard)
    @Post("/logout")  
    async logout(@Headers('Authorization') authorization: string): Promise<APIResponse> {
        return await this.authService.logout(authorization)
    }

    @UseGuards(AuthGuard)
    @Post("/refresh-token")
    async refreshAccessToken(@Body('refreshToken') refreshToken: string): Promise<APIResponse> {
        return await this.authService.refreshAccessToken(refreshToken);
    }
}
