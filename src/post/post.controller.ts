import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { APIResponse } from '../common/response/response.dto';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { AccessEntityEnum } from '../common/enums/access-entity.enum';
import { AccessActionEnum } from '../common/enums/access-action.enum';
import { Permission } from '../common/decorators/permission.decorator';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';

import { UpdatePostDTO } from './dtos/update-post.dto';
import { CreatePostDTO } from './dtos/create-post.dto';
import { PostService } from './post.service';

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

    @Permission(AccessEntityEnum.POST, AccessActionEnum.CREATE)
    @Post()
    async create(@Body() createPostDTO: CreatePostDTO, @Req() req): Promise<APIResponse> {
        return await this.postService.create(createPostDTO, req.currentUser);
    }

    @Permission(AccessEntityEnum.POST, AccessActionEnum.UPDATE)
    @Put()
    async update(@Body() updatePostDTO: UpdatePostDTO, @Req() req): Promise<APIResponse> {
        return await this.postService.update(updatePostDTO, req.currentUser);
    }

    @Permission(AccessEntityEnum.POST, AccessActionEnum.DELETE)
    @Delete(":id")
    async remove(@Param("id") id: string, @Req() req): Promise<APIResponse> {
        return await this.postService.remove(id, req.currentUser);
    }
}
