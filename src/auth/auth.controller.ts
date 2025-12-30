import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, Req, Session } from '@nestjs/common';
import { Serialize } from './interceptors/serialize.interceptor.js';
import { AuthService } from './auth.service.js';
import { LoginDTO } from './dtos/login.dto.js';
import { SignupDTO } from './dtos/signup.dto.js';
import { User } from '../user/entities/user.entity.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Serialize(User)
    @Public()
    @Post("/signup")
    signup(@Body() signupDTO: SignupDTO): Promise<User> {
        return this.authService.signup(signupDTO);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @Public()
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<string> {
        const id = await this.authService.login(loginDTO);

        session.userId = id;

        return "Login Successful."
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
}
