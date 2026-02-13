import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { type IPostRepository, POSTS_REPOSITORY } from './post.repository.interface';

@Injectable()
export class PostService {
    constructor(
        @Inject(POSTS_REPOSITORY)
        private readonly postRepository: IPostRepository,
    ) { }

    async findAll(user: User): Promise<APIResponse> {
        const posts = await this.postRepository.findAll(user.id);
        if (!posts || posts.length === 0) throw new NotFoundException('No posts found.');
        return {
            success: true,
            message: 'Posts fetched successfully',
            data: posts,
            expired: false,
            statusCode: 200,
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const post = await this.postRepository.findOne(id);
        if (!post) throw new NotFoundException('Post not found.');
        return {
            success: true,
            message: 'Post fetched successfully',
            data: post,
            expired: false,
            statusCode: 200,
        };
    }

    async create(createPostDTO: CreatePostDTO, user: User): Promise<APIResponse> {
        if (!user) throw new BadRequestException('User not found.');

        const newPost = {
            name: createPostDTO.name,
            description: createPostDTO.description,
            user: user,
        };

        const post = await this.postRepository.create(newPost);
        if (!post) throw new InternalServerErrorException('Failed to create post.');

        return {
            success: true,
            message: 'Post created successfully.',
            data: post,
            expired: false,
            statusCode: 201,
        };
    }

    async update(updatePostDTO: UpdatePostDTO, user: User): Promise<APIResponse> {
        const existingPost = await this.postRepository.findOne(updatePostDTO.id);
        if (!existingPost) throw new NotFoundException('Post not found.');

        if (existingPost.user.id !== user.id)
            throw new BadRequestException('You can only update your own posts.');

        const updatedPost = await this.postRepository.update(updatePostDTO.id, updatePostDTO);
        if (!updatedPost)
            throw new InternalServerErrorException('Failed to update post.');

        return {
            success: true,
            message: 'Post updated successfully.',
            data: updatedPost,
            expired: false,
            statusCode: 200,
        };
    }

    async remove(id: string, user: User): Promise<APIResponse> {
        const existingPost = await this.postRepository.findOne(id);
        if (!existingPost) throw new NotFoundException('Post not found.');

        if (existingPost.user.id !== user.id)
            throw new BadRequestException('You can only delete your own posts.');

        const result = await this.postRepository.remove(id);
        if (!result)
            throw new InternalServerErrorException('Error while deleting post.');

        return {
            success: true,
            message: 'Post deleted successfully.',
            data: result,
            expired: false,
            statusCode: 200,
        };
    }
}
