import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Session } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { Role } from './entities/role.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { User } from '../user/entities/user.entity.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';

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
    @Permission("role", "create")
    create(@Body() dto: CreateRoleDTO, @CurrentOrganizationId() Id: string): Promise<Role> {
        return this.roleService.create(dto, Id);
    }

    @Put()
    @Permission("role", "update")
    update(@Body() dto: UpdateRoleDTO): Promise<Role> {
        return this.roleService.update(dto);
    }

    @Delete(':id')
    @Permission("role", "delete")
    delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
