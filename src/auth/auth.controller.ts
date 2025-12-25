import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dtos/create-user.dto';
import { User } from './entities/create-user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    async signup(@Body() body: UserDTO): Promise<User> {
        return this.authService.signup(body);
    }
}
