import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Post, Res, Session, UseGuards } from '@nestjs/common';
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
        const signup = await this.authService.signup(signupDTO);

        if(!signup.success) {
            res.status(400).json({ success: signup.success, message: signup.message });
        }

        res.status(201).json({ success: signup.success, message: signup.message });
    }

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(HcaptchaGuard)
    async login(@Body() loginDTO: LoginDTO, @Session() session: any, @Res({ passthrough: true }) res: Response): Promise<void> {
        const id = await this.authService.login(loginDTO);

        if (!id) {
            res.status(401).json({ success: false, message: "Invalid Credentials."});
        }

        session.userId = id;

        res.status(200).json({ success: true, message: "Login Successful."})
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
