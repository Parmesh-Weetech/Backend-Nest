import { Controller, Get, Param, Put, Delete, Body, UseGuards, Post, Res, Headers } from '@nestjs/common';
import { PermissionService } from './permission.service.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import type { Response } from 'express';

@Controller('permissions')
@UseGuards(AuthGuard, PermissionsGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Get()
    async findAll(@Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const permissions = await this.permissionService.findAll();

        res.status(permissions.statusCode).send(permissions);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const permission = await this.permissionService.findOne(id);

        res.status(permission.statusCode).send(permission);
    }

    @Post()
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.CREATE)
    async create(@Body() dto: CreatePermissionDTO, @CurrentOrganizationId() Id: string, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const permission = await this.permissionService.create(dto, Id);

        res.status(permission.statusCode).send(permission);
    }

    @Put()
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.UPDATE)
    async update(@Body() dto: UpdatePermissionDTO, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const permission = await this.permissionService.update(dto);

        res.status(permission.statusCode).send(permission);
    }

    @Delete(':id')
    @PermissionDecorator(AccessEntityEnum.PERMISSION, AccessActionEnum.DELETE)
    async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const permission = await this.permissionService.remove(id);

        res.status(permission.statusCode).send(permission);
    }
}
