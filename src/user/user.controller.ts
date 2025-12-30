import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Session, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { currentUser } from '../common/decorators/currentUser.decorator.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { LoginDTO } from '../auth/dtos/login.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

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
    @Permission("user-manager", "user", "create")
    async createUser(@Body() createUserDTO: CreateUserDTO, @currentUser() user: User): Promise<User> {
        return this.userService.create(createUserDTO, user);
    }

    @Put()
    @Permission("user-manager", "user", "update")
    async updateUser(@Body() updateUserDTO: updateUserDTO): Promise<User | null> {
        return this.userService.update(updateUserDTO);
    }

    @Delete(":id")
    @Permission("user-manager", "user", "delete")
    async deleteUser(@Param("id") id: string): Promise<string | null> {
        return this.userService.delete(id);
    }
}
