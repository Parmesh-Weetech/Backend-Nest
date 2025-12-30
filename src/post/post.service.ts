import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity.js';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dtos/create-post.dto.js';
import { User } from '..//user/entities/user.entity.js';
import { UpdatePostDTO } from './dtos/update-post.dto.js';

@Injectable()
export class PostService {
    constructor(@InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>) { }

    async getPostById(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });

        if (!post) {
            throw new NotFoundException("Post not found.");
        }

        return post;
    }

    async getPosts(): Promise<PostEntity[]> {
        const posts = await this.postRepository.find({ relations: ['user'] });

        if (posts.length === 0) {
            throw new NotFoundException("Posts not found.");
        }

        return posts;
    }

    async createPost(post: CreatePostDTO, user: User): Promise<PostEntity> {
        if (!user) throw new NotFoundException('User not found');

        const newPost = await this.postRepository.create({
            name: post.name,
            description: post.description,
            user: user
        })

        return await this.postRepository.save(newPost);
    }

    async updatePost(post: UpdatePostDTO): Promise<PostEntity> {
        const existingPost = await this.getPostById(post.id);

        if (!existingPost) throw new NotFoundException('Post not found');

        if (post.name) existingPost.name = post.name;
        if (post.description) existingPost.description = post.description;

        return this.postRepository.save(post);
    }

    async deletePost(id: string): Promise<string> {
        const existingPost = await this.getPostById(id);

        if (!existingPost) throw new NotFoundException('Post not found');

        const deletePost = await this.postRepository.softDelete(id);

        if (deletePost.affected !== undefined && deletePost.affected !== null && deletePost.affected > 0) {
            return "Post Deleted Successfully."
        }

        throw new InternalServerErrorException("Error while deleteing post.")
    }
}
