import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { Role } from './entities/role.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
    findOne(@Param('id') id: string): Promise<Role> {
        return this.roleService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDTO): Promise<Role> {
        return this.roleService.updateRole(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.roleService.deleteRole(id);
    }
}
