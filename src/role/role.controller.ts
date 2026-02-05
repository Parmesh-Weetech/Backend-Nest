import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard.js';
import { APIResponse } from '../common/response/response.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';

import { RoleService } from './role.service.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';

@Controller('roles')
@UseGuards(AuthGuard, PermissionsGuard)
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Get()
    async findAll(): Promise<APIResponse> {
        return await this.roleService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<APIResponse> {
        return await this.roleService.findOne(id);
    }

    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.CREATE)
    @Post()
    async create(@Body() dto: CreateRoleDTO, @CurrentOrganizationId() Id: string): Promise<APIResponse> {
        return await this.roleService.create(dto, Id);
    }

    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.UPDATE)
    @Put()
    async update(@Body() dto: UpdateRoleDTO): Promise<APIResponse> {
        return await this.roleService.update(dto);
    }

    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.DELETE)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<APIResponse> {
        return await this.roleService.remove(id);
    }
}
