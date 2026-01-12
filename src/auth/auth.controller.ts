import { Body, Controller, ForbiddenException, Headers, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Serialize } from './interceptors/serialize.interceptor.js';
import { AuthService } from './auth.service.js';
import { LoginDTO } from './dtos/login.dto.js';
import { SignupDTO } from './dtos/signup.dto.js';
import { User } from '../user/entities/user.entity.js';
import { Public } from '../common/decorators/public.decorator.js';
import { HcaptchaGuard } from '../common/guards/h-captcha.guard.js';
import type { Response } from 'express';
import { TokenResponse } from './dtos/refresh_token-response.dto.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Serialize(User)
    @Post("/signup")
    async signup(@Body() signupDTO: SignupDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const signup = await this.authService.signup(signupDTO);

        if (!signup.success) {
            res.status(400).json({ success: signup.success, message: signup.message });
        }

        res.status(201).json({ success: signup.success, message: signup.message });
    }

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(HcaptchaGuard)
    async login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.authService.login(loginDTO);

        if(!response.success) res.status(401).json({ success: response.success, message: response.message });

        res.status(200).send(response);
    }

    @Public()
    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Headers('authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const token = authorization?.split(' ')[1];

        if(!token) res.status(400).json({ success: false, message: "You must be logged in!" });

        const response = await this.authService.logout(token)

        if(!response.success) res.status(400).send(response);

        res.status(200).send(response);
    }

    @Public()
    @Post("/refresh-token")
    async refreshAccessToken(@Body('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.authService.refreshAccessToken(refreshToken);

        if(!response.success) res.status(403).send(response)

        res.status(200).send(response);
    }
}
