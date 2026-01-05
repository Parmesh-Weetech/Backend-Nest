import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(): Promise<User[]> {
        const users = await this.userService.findAll();

        if (!users) throw new NotFoundException("Users not found.");

        return users;
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<User> {
        const user = await this.userService.findOne(id);

        if (!user) throw new NotFoundException("User not found.");

        return user;
    }

    @Post()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.CREATE)
    async create(@Body() createUserDTO: CreateUserDTO, @CurrentOrganizationId() Id: string): Promise<User> {
        return this.userService.create(createUserDTO, Id);
    }

    @Put()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.UPDATE)
    async update(@Body() updateUserDTO: updateUserDTO): Promise<User> {
        return this.userService.update(updateUserDTO);
    }

    @Delete(":id")
    @Permission(AccessEntityEnum.USER, AccessActionEnum.DELETE)
    async delete(@Param("id") id: string): Promise<string> {
        return this.userService.delete(id);
    }
}
