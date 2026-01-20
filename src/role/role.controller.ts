import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Res, Headers } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import type { Response } from 'express';

@Controller('roles')
@UseGuards(AuthGuard, PermissionsGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    async findAll(@Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.roleService.findAll(authorization);

        res.status(response.statusCode).send(response);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.roleService.findOne(id, authorization);

        res.status(response.statusCode).send(response);
    }

    @Post()
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.CREATE)
    async create(@Body() dto: CreateRoleDTO, @CurrentOrganizationId() Id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.roleService.create(dto, Id, authorization);

        res.status(response.statusCode).send(response);
    }

    @Put()
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.UPDATE)
    async update(@Body() dto: UpdateRoleDTO, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.roleService.update(dto, authorization);

        res.status(response.statusCode).send(response);
    }

    @Delete(':id')
    @Permission(AccessEntityEnum.ROLE, AccessActionEnum.DELETE)
    async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.roleService.remove(id, authorization);

        res.status(response.statusCode).send(response);
    }
}
