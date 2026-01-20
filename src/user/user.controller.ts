import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import type { Response } from 'express';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(@Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.userService.findAll(authorization);

        res.status(response.statusCode).send(response);
    }

    @Get(":id")
    async findOne(@Param("id") id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.userService.findOne(id, authorization);

        res.status(response.statusCode).send(response);
    }

    @Post()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.CREATE)
    async create(@Body() createUserDTO: CreateUserDTO, @CurrentOrganizationId() Id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.userService.create(createUserDTO, Id, authorization);

        res.status(response.statusCode).send(response);
    }

    @Put()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.UPDATE)
    async update(@Body() updateUserDTO: updateUserDTO, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.userService.update(updateUserDTO, authorization);

        res.status(response.statusCode).send(response);
    }

    @Delete(":id")
    @Permission(AccessEntityEnum.USER, AccessActionEnum.DELETE)
    async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response, @Headers('Authorization') authorization: string): Promise<void> {
        const response = await this.userService.remove(id, authorization);

        res.status(response.statusCode).send(response);
    }
}
