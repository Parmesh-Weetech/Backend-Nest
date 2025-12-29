import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { Role } from './entities/role.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';

@Controller('roles')
@UseGuards(AuthGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    create(@Body() dto: CreateRoleDTO): Promise<Role> {
        return this.roleService.createRole(dto);
    }

    @Get()
    findAll(): Promise<Role[]> {
        return this.roleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Role | null> {
        return this.roleService.findOne(id);
    }

    @Put()
    update(@Body() dto: UpdateRoleDTO): Promise<Role | null> {
        return this.roleService.updateRole(dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.roleService.deleteRole(id);
    }
}
