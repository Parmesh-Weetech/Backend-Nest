import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard.js';
import { APIResponse } from '../common/response/response.dto.js';
import { CurrentUserGuard } from '../common/guards/currentUser.guard.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { AccessEntityEnum } from '../common/enums/access-entity.enum.js';
import { AccessActionEnum } from '../common/enums/access-action.enum.js';
import { Permission } from '../common/decorators/permission.decorator.js';
import { CurrentUser } from '../common/decorators/currentUser.decorator.js';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor.js';
import { User } from '../user/entities/user.entity.js';

import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { PostService } from './post.service.js';

@Controller('post')
@UseGuards(AuthGuard, CurrentUserGuard, PermissionsGuard)
export class PostController {

    constructor(
        private readonly postService: PostService
    ) { }

    @UseInterceptors(CurrentUserInterceptor)
    @Get()
    async findAll(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.postService.findAll(user);
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<APIResponse> {
        return await this.postService.findOne(id);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Permission(AccessEntityEnum.POST, AccessActionEnum.CREATE)
    @Post()
    async create(@Body() createPostDTO: CreatePostDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.postService.create(createPostDTO, user);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Permission(AccessEntityEnum.POST, AccessActionEnum.UPDATE)
    @Put()
    async update(@Body() updatePostDTO: UpdatePostDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.postService.update(updatePostDTO, user);
    }

    @UseInterceptors(CurrentUserInterceptor)
    @Permission(AccessEntityEnum.POST, AccessActionEnum.DELETE)
    @Delete(":id")
    async remove(@Param("id") id: string, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.postService.remove(id, user);
    }
}
