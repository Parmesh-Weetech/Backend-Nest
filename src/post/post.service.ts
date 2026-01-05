import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity.js';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { User } from '..//user/entities/user.entity.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';
import { PostCreationFailedError, PostDeletionFailedError, PostUpdationFailedError } from './errors/error.js';

@Injectable()
export class PostService {
    constructor(@InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>) { }

    async findAll(): Promise<PostEntity[]> {
        const posts = await this.postRepository.find({ relations: ['user'] });

        if (!posts) throw new NotFoundException("Posts not found.");

        return posts;
    }

    async findOne(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });

        if (!post) throw new NotFoundException("Post not found.");

        return post;
    }

    async create(post: CreatePostDTO, user: User): Promise<PostEntity> {
        if (!user) throw new NotFoundException('User not found');

        try {
            const newPost = await this.postRepository.create({
                name: post.name,
                description: post.description,
                user: user
            });

            return await this.postRepository.save(newPost);
        } catch (error) {
            throw new PostCreationFailedError();
        }
    }

    async update(post: UpdatePostDTO): Promise<PostEntity> {
        const existingPost = await this.findOne(post.id);

        if (post.name) existingPost.name = post.name;
        if (post.description) existingPost.description = post.description;

        try {
            return this.postRepository.save(post);
        } catch (error) {
            throw new PostUpdationFailedError();
        }
    }

    async delete(id: string): Promise<string> {
        const existingPost = await this.findOne(id);

        try {
            const deletePost = await this.postRepository.softDelete(id);
            
            return "Post Deleted Successfully."
        } catch (error) {
            throw new PostDeletionFailedError();
        }
    }
}
