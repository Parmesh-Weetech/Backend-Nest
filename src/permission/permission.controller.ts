import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post } from '@nestjs/common';
import { PermissionService } from './permission.service.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { Permission } from './entities/permission.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator.js';

@Controller('permissions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Get()
    findAll(): Promise<Permission[]> {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.findOne(id);
    }

    @Post()
    @PermissionDecorator("permission", "create")
    create(@Body() dto: CreatePermissionDTO): Promise<Permission> {
        return this.permissionService.create(dto)
    }

    @Put()
    @PermissionDecorator("permission", "update")
    update(@Body() dto: UpdatePermissionDTO): Promise<Permission> {
        return this.permissionService.update(dto);
    }

    @Delete(':id')
    @PermissionDecorator("permission", "delete")
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}
