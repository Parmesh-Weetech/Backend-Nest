import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { SignupDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Serialize(Auth)
    @Post("/signup")
    signup(@Body() signupDTO: SignupDTO): Promise<Auth> {
        return this.authService.signup(signupDTO);
    }

    @Post('/login')
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<string> {
        const id = await this.authService.login(loginDTO);

        session.userId = id;

        return "Login Successful."
    }

}
