import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
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
    signup(@Body() signupDTO: SignupDTO): Promise<User> {
        return this.authService.signup(signupDTO);
    }

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(HcaptchaGuard)
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<any> {
        const data = await this.authService.login(loginDTO);

        return {
            success: true,
            message: "Login Successful.",
            access_token: data.access_token,
            refresh_token: data.refresh_token
        }
    }

    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    @Public()
    async logout(@Session() session: any): Promise<string> {
        if (session.userId) {
            session.userId = null;
            return "Logout Successful."
        }

        throw new ForbiddenException("You must be loggedin to perform this action!")
    }

    @Get("/g")
    async getAuth() {
        console.log("getting auth")
        return "auth"
    }
}
