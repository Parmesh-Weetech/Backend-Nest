import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity.js';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { User } from '../user/entities/user.entity.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { PostCreationFailedError, PostDeletionFailedError, PostUpdationFailedError } from './errors/error.js';
import { APIResponse } from '../common/response/response.dto.js';

@Injectable()
export class PostService {
    constructor(@InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>) { }

    async findAll(): Promise<APIResponse> {
        const posts = await this.postRepository.find({ relations: ['user'] });

        if (!posts) return {
            success: false,
            message: "Posts not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

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

        if (!post) return {
            success: false,
            message: "Post not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Post fetched successfully",
            data: post,
            expired: false,
            statusCode: 200
        };
    }

    async create(post: CreatePostDTO, user: User): Promise<APIResponse> {
        if (!user) {
            return {
                success: false,
                expired: false,
                message: "User not found",
                data: null,
                statusCode: 404
            }
        }

        try {
            const newPost = await this.postRepository.create({
                name: post.name,
                description: post.description,
                user: user
            });

            const savePost = await this.postRepository.save(newPost);

            return {
                success: true,
                message: "Post created successfully.",
                expired: false,
                data: savePost,
                statusCode: 201
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                expired: false,
                data: null,
                statusCode: 500
            }
        }
    }

    async update(post: UpdatePostDTO): Promise<APIResponse> {
        const existingPost = await this.findOne(post.id);

        if (post.name) existingPost.data.name = post.name;
        if (post.description) existingPost.data.description = post.description;

        try {
            const savePost = await this.postRepository.save(post);

            return {
                success: true,
                message: "Post updated successfully.",
                expired: false,
                data: savePost,
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                expired: false,
                data: null,
                statusCode: 500
            }
        }
    }

    async remove(id: string): Promise<APIResponse> {
        const existingPost = await this.findOne(id);

        if(!existingPost) {
            return {
                success: false,
                statusCode: 403,
                message: "Post not found",
                expired: false,
                data: null
            }
        }

        try {
            const deletePost = await this.postRepository.softDelete(id);
            
            return {
                success: true,
                statusCode: 200,
                message: "Post deleted successfully.",
                expired: false,
                data: deletePost.raw
            }
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: error.message,
                expired: false,
                data: null
            }
        }
    }
}
