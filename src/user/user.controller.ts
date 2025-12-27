import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Session, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { updateUserDTO } from './dtos/update-user.dto';
import { currentUser } from 'src/common/decorators/currentUser.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginDTO } from 'src/auth/dtos/login.dto';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Public()
    @Post("login")
    async login(@Body() loginDTO: LoginDTO, @Session() session: any): Promise<string> {
        const user = await this.userService.login(loginDTO);

        session.userId = user.id;

        return "Login Successful."
    }

    @Get(":id")
    async findOneUser(@Param("id") id: string): Promise<User> {
        const user = await this.userService.findOne(id);

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    @Get()
    async findUsers(): Promise<User[]> {
        const users = await this.userService.findUsers();

        if (!users) {
            throw new NotFoundException("Users not found.");
        }

        return users;
    }

    @Post()
    @Permission("ADMIN", "SYSTEM")
    async createUser(@Body() createUserDTO: CreateUserDTO, @currentUser() user: User): Promise<User> {
        return this.userService.create(createUserDTO, user);
    }

    @Put()
    @Permission("ADMIN", "SYSTEM")
    async updateUser(@Body() updateUserDTO: updateUserDTO): Promise<User | null> {
        return this.userService.update(updateUserDTO);
    }

    @Delete(":id")
    @Permission("ADMIN", "SYSTEM")
    async deleteUser(@Param("id") id: string): Promise<string | null> {
        return this.userService.delete(id);
    }
}
