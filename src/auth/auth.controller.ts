import { Body, Controller, Post } from '@nestjs/common';
import { SignupDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { Auth } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
    @Post("/signup")
    signup(@Body() signupDTO: SignupDTO): Promise<Auth> {

    }

    @Post('/login')
    login(@Body() loginDTO: LoginDTO): Promise<Auth> {

    }
}
