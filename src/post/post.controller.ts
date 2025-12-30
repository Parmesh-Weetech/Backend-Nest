import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard.js';
import { PostEntity } from './entities/post.entity.js';
import { currentUser } from '../common/decorators/currentUser.decorator.js';
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
    @Get(":id")
    async getPostById(@Param("id") id: string): Promise<PostEntity> {
        return await this.postService.getPostById(id);
    }

    @Get()
    async getPosts(): Promise<PostEntity[]> {
        return await this.postService.getPosts();
    }

    @Post()
    @Permission("post-manager", "post", "create")
    async createPost(@Body() createPostDTO: CreatePostDTO, @currentUser() user: User): Promise<PostEntity> {
        return await this.postService.createPost(createPostDTO, user);
    }

    @Put()
    @Permission("post-manager", "post", "update")
    async updatePost(@Body() updatePostDTO: UpdatePostDTO): Promise<PostEntity> {
        return await this.postService.updatePost(updatePostDTO);
    }

    @Delete(":id")
    @Permission("post-manager", "post", "delete")
    async deletePost(@Param("id") id: string): Promise<string> {
        return await this.postService.deletePost(id);
    }
}
