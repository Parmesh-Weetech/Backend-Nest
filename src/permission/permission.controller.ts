import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { APIResponse } from '../common/response/response.dto';
import { CreatePermissionDTO } from './dtos/create-permission.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { AccessEntityEnum } from '../common/enums/access-entity.enum';
import { AccessActionEnum } from '../common/enums/access-action.enum';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator';

import { PermissionService } from './permission.service';
import { UpdatePermissionDTO } from './dtos/update-permission.dto';

@Controller('permissions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }

    @Get()
    async findAll(): Promise<APIResponse> {
        return await this.permissionService.findAll();
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
