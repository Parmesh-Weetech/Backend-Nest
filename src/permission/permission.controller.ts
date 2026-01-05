import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post } from '@nestjs/common';
import { PermissionService } from './permission.service.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { Permission } from './entities/permission.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';

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
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.CREATE)
    create(@Body() dto: CreatePermissionDTO, @CurrentOrganizationId() Id: string): Promise<Permission> {
        return this.permissionService.create(dto, Id)
    }

    @Put()
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.UPDATE)
    update(@Body() dto: UpdatePermissionDTO): Promise<Permission> {
        return this.permissionService.update(dto);
    }

    @Delete(':id')
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.DELETE)
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}
