import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard.js';
import { APIResponse } from '../common/response/response.dto.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import { CurrentUser } from '../common/decorators/currentUser.decorator.js';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor.js';

import { PermissionService } from './permission.service.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { User } from '../user/entities/user.entity.js';

@Controller('permissions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }

    @UseInterceptors(CurrentUserInterceptor)
    @Get()
    async findAll(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.permissionService.findAll(user);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<APIResponse> {
        return await this.permissionService.findOne(id);
    }

    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.CREATE)
    @Post()
    async create(@Body() dto: CreatePermissionDTO, @CurrentOrganizationId() Id: string): Promise<APIResponse> {
        return await this.permissionService.create(dto, Id);
    }

    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.UPDATE)
    @Put()
    async update(@Body() dto: UpdatePermissionDTO): Promise<APIResponse> {
        return await this.permissionService.update(dto);
    }

    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.DELETE)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<APIResponse> {
        return await this.permissionService.remove(id);
    }
}
