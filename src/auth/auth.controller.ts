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

        res.status(200).send(response);
    }

    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    @Public()
    async logout(@Headers('authorization') authorization: string): Promise<string> {
        const token = authorization?.split(' ')[1];

        if(!token) {
            throw new ForbiddenException("You must be loggedin to perform this action!")
        }

        return await this.authService.logout(token)
    }

    @Post("/refresh-token")
    @Public()
    async refreshAccessToken(@Body('refreshToken') refreshToken: string): Promise<TokenResponse> {
        return await this.authService.refreshAccessToken(refreshToken)
    }
}
