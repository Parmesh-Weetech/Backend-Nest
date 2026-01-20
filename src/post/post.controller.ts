import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { CurrentUser } from '../common/decorators/currentUser.decorator.js';
import { User } from '../user/entities/user.entity.js';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { PostService } from './post.service.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import type { Response } from 'express';

@Controller('post')
@UseGuards(AuthGuard, PermissionsGuard)
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Get()
    async findAll(@Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const response = await this.postService.findAll(authorization);

        res.status(response.statusCode).send(response);
    }

    @Get(":id")
    async findOne(@Param("id") id: string, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const response = await this.postService.findOne(id, authorization);

        res.status(response.statusCode).send(response);
    }

    @Post()
    @Permission(AccessEntityEnum.POST, AccessActionEnum.CREATE)
    async create(@Body() createPostDTO: CreatePostDTO, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const response = await this.postService.create(createPostDTO, authorization);

        res.status(response.statusCode).send(response);
    }

    @Put()
    @Permission(AccessEntityEnum.POST, AccessActionEnum.UPDATE)
    async update(@Body() updatePostDTO: UpdatePostDTO, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const response = await this.postService.update(updatePostDTO, authorization);

        res.status(response.statusCode).send(response);
    }

    @Delete(":id")
    @Permission(AccessEntityEnum.POST, AccessActionEnum.DELETE)
    async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response, @Headers("Authorization") authorization: string): Promise<void> {
        const response = await this.postService.remove(id, authorization);

        res.status(response.statusCode).send(response);
    }
}
