import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { APIResponse } from '../common/response/response.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { AccessEntityEnum } from '../common/enums/access-entity.enum';
import { AccessActionEnum } from '../common/enums/access-action.enum';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { CurrentOrganizationGuard } from '../common/guards/currentOrganization.guard';

import { RoleService } from './role.service';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';

@Controller('roles')
@UseGuards(AuthGuard, CurrentUserGuard, CurrentOrganizationGuard, PermissionsGuard)
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
