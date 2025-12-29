import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { Serialize } from './interceptors/serialize.interceptor.js';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { User } from '../user/entities/user.entity.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Serialize(User)
    @Public()
    @Post("/signup")
    signup(@Body() signupDTO: SignupDTO): Promise<User> {
        return this.authService.signup(signupDTO);
    }

    @Post('/login')
    @Public()
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<string> {
        const id = await this.authService.login(loginDTO);

        session.userId = id;

        return "Login Successful."
    }

}
