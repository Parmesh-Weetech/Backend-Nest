import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity.js';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { User } from '../user/entities/user.entity.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { Response } from '../common/response/response.dto.js';
import { Auth } from '../common/util/auth.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
        private readonly auth: Auth,
        private readonly userService: UserService

    ) { }

    async findAll(authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

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

    async findOne(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

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

    async create(post: CreatePostDTO, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        try {
            const newPost = await this.postRepository.create({
                name: post.name,
                description: post.description,
                user: isUserExists.data
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

    async update(post: UpdatePostDTO, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const existingPost = await this.findOne(post.id, authorization);

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

    async remove(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }
        
        const existingPost = await this.findOne(id, authorization);

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
