import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserDTO } from './dtos/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Post()
    async create(@Body() body: UserDTO): Promise<User> {
        return await this.userService.create(body);
    }

    @Get(":id")
    async findById(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findById(id);
        
        if(!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    @Put()
    async update(@Body() body: UserDTO): Promise<User> {
        return await this.userService.update(body);
    }

    @Delete(":id")
    async delete(@Param('id') id: string): Promise<string> {
        const affectedRow = await this.userService.delete(id);

        if(!affectedRow) {
            throw new InternalServerErrorException("Internal server error while deleting user");
        }

        return "User Deleted Successfully."
    }
}
