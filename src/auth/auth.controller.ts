import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Serialize } from './interceptors/serialize.interceptor.js';
import { AuthService } from './auth.service.js';
import { LoginDTO } from './dtos/login.dto.js';
import { SignupDTO } from './dtos/signup.dto.js';
import { User } from '../user/entities/user.entity.js';
import { Public } from '../common/decorators/public.decorator.js';
import { HcaptchaGuard } from '../common/guards/h-captcha.guard.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Serialize(User)
    @Post("/signup")
    async signup(@Body() signupDTO: SignupDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.authService.signup(signupDTO);

        res.status(response.statusCode).send(response);
    }

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(HcaptchaGuard)
    async login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.authService.login(loginDTO);

        res.status(response.statusCode).send(response);
    }

    @Public()
    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const token = authorization?.split(' ')[1];

        if (!token) {
            res.status(400).json({ success: false, message: "You must be logged in!" });
            return;
        }

        const response = await this.authService.logout(token)

        res.status(response.statusCode).send(response);
    }

    @Public()
    @Post("/refresh-token")
    async refreshAccessToken(@Body('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.authService.refreshAccessToken(refreshToken);

        res.status(response.statusCode).send(response);
    }
}
