import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { updateUserDTO } from './dtos/update-user.dto';
import { currentUser } from 'src/common/decorators/currentUser.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginDTO } from 'src/auth/dtos/login.dto';
import { CurrentUserInterceptor } from 'src/common/interceptors/currentUser.interceptor';

@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
// @Serialize(SignupDTO)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("login")
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<string> {
        const user = await this.userService.login(loginDTO);

        session.userId = user.id;

        console.log(session.userId);

        return "Login Successful."
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    async findOneUser(@Param("id") id: string): Promise<User> {
        const user = await this.userService.findOne(id);

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    @Get()
    @UseGuards(AuthGuard)
    async findUsers(): Promise<User[]> {
        const users = await this.userService.findUsers();

        if (!users) {
            throw new NotFoundException("Users not found.");
        }

        return users;
    }

    @Post()
    @UseGuards(AuthGuard)
    async createUser(@Body() createUserDTO: CreateUserDTO, @currentUser() user: User): Promise<User> {
        return this.userService.create(createUserDTO, user);
    }

    @Put()
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateUserDTO: updateUserDTO): Promise<User> {
        return this.userService.update(updateUserDTO);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async deleteUser(@Param("id") id: string): Promise<string> {
        return this.userService.delete(id);
    }
}
