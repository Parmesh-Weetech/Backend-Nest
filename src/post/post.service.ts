import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { PostEntity } from './entities/post.entity';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) { }

    async findAll(user: User): Promise<APIResponse> {
        const posts = await this.postRepository.find({ where: { user: user }, relations: ['user'] });
        if (!posts) throw new NotFoundException('No posts found.');

        return {
            success: true,
            message: "Posts fetched successfully",
            data: posts,
            expired: false,
            statusCode: 200
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
        if (!post) throw new NotFoundException('Post not found.');

        return {
            success: true,
            message: "Post fetched successfully",
            data: post,
            expired: false,
            statusCode: 200
        };
    }

    async create(post: CreatePostDTO, user: User): Promise<APIResponse> {
        if (!user) throw new BadRequestException('User not found.');

        const newPost = this.postRepository.create({
            name: post.name,
            description: post.description,
            user: user
        });

        const savePost = await this.postRepository.save(newPost);
        if (!savePost) throw new InternalServerErrorException('Failed to create post.');

        return {
            success: true,
            message: "Post created successfully.",
            expired: false,
            data: savePost,
            statusCode: 201
        }
    }

    async update(postDTO: UpdatePostDTO, user: User): Promise<APIResponse> {
        const existingPost = await this.findOne(postDTO.id);
        if(existingPost.data.user.id !== user.id) throw new BadRequestException('You can only update your own posts.');

        if (postDTO.name) existingPost.data.name = postDTO.name;
        if (postDTO.description) existingPost.data.description = postDTO.description;

        const savePost = await this.postRepository.save(postDTO);
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

        const deletePost = await this.postRepository.softDelete(id);
        if(deletePost.affected === undefined && deletePost.affected === null && deletePost.affected === 0) throw new InternalServerErrorException("Error while deleting post.");

        return {
            success: true,
            statusCode: 200,
            message: "Post deleted successfully.",
            expired: false,
            data: deletePost.raw
        }
    }
}
