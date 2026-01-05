import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Session } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { Role } from './entities/role.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';

@Controller('roles')
@UseGuards(AuthGuard, PermissionsGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    findAll(): Promise<Role[]> {
        return this.roleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Role> {
        return this.roleService.findOne(id);
    }

    @Post()
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.CREATE)
    create(@Body() dto: CreateRoleDTO, @CurrentOrganizationId() Id: string): Promise<Role> {
        return this.roleService.create(dto, Id);
    }

    @Put()
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.UPDATE)
    update(@Body() dto: UpdateRoleDTO): Promise<Role> {
        return this.roleService.update(dto);
    }

    @Delete(':id')
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.DELETE)
    delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
