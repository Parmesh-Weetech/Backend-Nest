import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { CurrentOrganizationId } from '../common/decorators/currentOrganizationId.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/currentUser.decorator.js';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor.js';

@Controller('user')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseInterceptors(CurrentUserInterceptor)
    async findAll(@Res() res: Response, @CurrentUser() user: User): Promise<void> {
        const response = await this.userService.findAll(user);
        res.setHeader('Cache-Control', 'no-store');
        
        res.status(response.statusCode).send(response);
    }

    @Get("/all")
    async findAllUser(@Res({ passthrough: true }) res: Response, @CurrentUser() user: User): Promise<void> {
        const response = await this.userService.findAllUser(user);

        res.status(response.statusCode).send(response);
    }

    @Get(":id")
    async findOne(@Param("id") id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.userService.findOne(id);

        res.status(response.statusCode).send(response);
    }

    @Post()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.CREATE)
    async create(@Body() createUserDTO: CreateUserDTO, @CurrentOrganizationId() Id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.userService.create(createUserDTO, Id);

        res.status(response.statusCode).send(response);
    }

    @Put()
    @Permission(AccessEntityEnum.USER, AccessActionEnum.UPDATE)
    async update(@Body() updateUserDTO: updateUserDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.userService.update(updateUserDTO);

        res.status(response.statusCode).send(response);
    }

    @Delete(":id")
    @Permission(AccessEntityEnum.USER, AccessActionEnum.DELETE)
    async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.userService.remove(id);

        res.status(response.statusCode).send(response);
    }
}
