import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';

import { AuthGuard } from '../common/guards/auth.guard';
import { APIResponse } from '../common/response/response.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { AccessEntityEnum } from '../common/enums/access-entity.enum';
import { AccessActionEnum } from '../common/enums/access-action.enum';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    
    @UseInterceptors(CurrentUserInterceptor)
    @Get()
    async findAllCachedUser(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.userService.findAllCachedUser(user);
    }

    @Get("/all")
    async findAllUser(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.userService.findAllUser(user);
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<APIResponse> {
        return await this.userService.findOne(id);
    }

    @Permission(AccessEntityEnum.USER, AccessActionEnum.CREATE)
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO, @CurrentOrganizationId() Id: string): Promise<APIResponse> {
        return await this.userService.create(createUserDTO, Id);
    }

    @Permission(AccessEntityEnum.USER, AccessActionEnum.UPDATE)
    @Put()
    async update(@Body() updateUserDTO: updateUserDTO): Promise<APIResponse> {
        return await this.userService.update(updateUserDTO);
    }

    @Permission(AccessEntityEnum.USER, AccessActionEnum.DELETE)
    @Delete(":id")
    async remove(@Param("id") id: string): Promise<APIResponse> {
        return await this.userService.remove(id);
    }
}
