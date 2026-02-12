import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { PostEntity } from './entities/post.entity';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private readonly postRepository: PostRepository
    ) { }

    async findAll(userId: string): Promise<APIResponse> {
        const posts = await this.postRepository.findAll(userId);
        if (!posts) throw new NotFoundException('No posts found.');

        return {
            success: true,
            message: "Posts fetched successfully",
            data: posts.length > 0 ? posts : [],
            expired: false,
            statusCode: 200
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const post = await this.postRepository.findById(id);
        if (!post) throw new NotFoundException('Post not found.');

        return {
            success: true,
            message: "Post fetched successfully",
            data: post,
            expired: false,
            statusCode: 200
        };
    }

    async create(post: CreatePostDTO, userId: string): Promise<APIResponse> {
        if (!userId) throw new BadRequestException('User not found.');

        const newPost = this.postRepository.createPost(post, userId);

        if (!newPost) throw new InternalServerErrorException('Failed to create post.');

        return {
            success: true,
            message: "Post created successfully.",
            expired: false,
            data: newPost,
            statusCode: 201
        }
    }

    async update(postDTO: UpdatePostDTO, user: User): Promise<APIResponse> {
        const existingPost = await this.findOne(postDTO.id);
        if(existingPost.data.user.id !== user.id) throw new BadRequestException('You can only update your own posts.');

        if (postDTO.name) existingPost.data.name = postDTO.name;
        if (postDTO.description) existingPost.data.description = postDTO.description;

        const savePost = await this.postRepository.updatePost(existingPost.data);
        if (!savePost) throw new InternalServerErrorException('Failed to update post.');

        return {
            success: true,
            message: "Post updated successfully.",
            expired: false,
            data: savePost,
            statusCode: 200
        }
    }

    async remove(id: string, user: User): Promise<APIResponse> {
        const existingPost = await this.findOne(id);
        if(existingPost.data.user.id !== user.id) throw new BadRequestException('You can only delete your own posts.');

        const deletePost = await this.postRepository.softDeletePost(id);
        if(!deletePost) throw new InternalServerErrorException("Error while deleting post.");

        return {
            success: true,
            statusCode: 200,
            message: "Post deleted successfully.",
            expired: false,
            data: null
        }
    }
}
