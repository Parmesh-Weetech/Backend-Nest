import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/create-user.entity';
import { updateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { Serialize } from './interceptors/serialize.interceptor';

@Controller('user')
@Serialize(UserDTO)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("signup")
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.userService.create(createUserDTO);
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

    @Put()
    async updateUser(@Body() updateUserDTO: updateUserDTO): Promise<User> {
        return this.userService.update(updateUserDTO);
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string): Promise<string> {
        return this.userService.delete(id);
    }
}
