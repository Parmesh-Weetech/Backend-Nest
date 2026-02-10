import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { APIResponse } from '../common/response/response.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { AccessEntityEnum } from '../common/enums/access-entity.enum';
import { AccessActionEnum } from '../common/enums/access-action.enum';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator';

import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';

@Controller('user')
@UseGuards(AuthGuard, CurrentUserGuard, PermissionsGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    
    @Get()
    async findAllCachedUser(@Req() req): Promise<APIResponse> {
        return await this.userService.findAllCachedUser(req.currentUser.id);
    }

    @Get("/all")
    async findAllUser(@Req() req): Promise<APIResponse> {
        return await this.userService.findAllUser(req.currentUser.id);
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
