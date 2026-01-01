import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { PostEntity } from './entities/post.entity.js';
import { CurrentUser } from '../common/decorators/currentUser.decorator.js';
import { User } from '../user/entities/user.entity.js';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { PostService } from './post.service.js';
import { PermissionsGuard } from '../common/guards/permission.guard.js';
import { Permission } from '../common/decorators/permission.decorator.js';

@Controller('post')
@UseGuards(AuthGuard, PermissionsGuard)
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Get()
    async findAll(): Promise<PostEntity[]> {
        return await this.postService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<PostEntity> {
        return await this.postService.findOne(id);
    }

    @Post()
    @Permission("post", "create")
    async create(@Body() createPostDTO: CreatePostDTO, @CurrentUser() user: User): Promise<PostEntity> {
        return await this.postService.create(createPostDTO, user);
    }

    @Put()
    @Permission("post", "update")
    async update(@Body() updatePostDTO: UpdatePostDTO): Promise<PostEntity> {
        return await this.postService.update(updatePostDTO);
    }

    @Delete(":id")
    @Permission("post", "delete")
    async delete(@Param("id") id: string): Promise<string> {
        return await this.postService.delete(id);
    }
}
