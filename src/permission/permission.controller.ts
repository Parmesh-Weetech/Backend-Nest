import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post } from '@nestjs/common';
import { PermissionService } from './permission.service.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { Permission } from './entities/permission.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    create(@Body() dto: CreatePermissionDTO): Promise<Permission> {
        return this.permissionService.create(dto)
    }

    @Get()
    findAll(): Promise<Permission[]> {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Permission | null> {
        return this.permissionService.findOne(id);
    }

    @Put()
    update(@Body() dto: UpdatePermissionDTO): Promise<Permission | null> {
        return this.permissionService.update(dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}
