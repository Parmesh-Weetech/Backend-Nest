import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostEntity } from './entities/post.entity';
import { currentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { PostService } from './post.service';
import { PermissionsGuard } from './guards/permission.guard';
import { Permission } from './decorators/permission.decorator';
import { CurrentUserInterceptor } from 'src/common/interceptors/currentUser.interceptor';

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
    @Permission("CREATE_POST")
    async createPost(@Body() createPostDTO: CreatePostDTO, @currentUser() user: User): Promise<PostEntity> {
        return await this.postService.createPost(createPostDTO, user);
    }

    @Put()
    @Permission("UPDATE_POST")
    async updatePost(@Body() updatePostDTO: UpdatePostDTO): Promise<PostEntity> {
        return await this.postService.updatePost(updatePostDTO);
    }

    @Delete(":id")
    @Permission("DELETE_POST")
    async deletePost(@Param("id") id: string): Promise<string> {
        return await this.postService.deletePost(id);
    }
}
