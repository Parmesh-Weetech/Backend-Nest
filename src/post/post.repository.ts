import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PostEntity } from "./entities/post.entity";
import { CreatePostDTO } from "./dtos/create-post.dto";
import { UpdatePostDTO } from "./dtos/update-post.dto";

@Injectable()
export class PostRepository extends Repository<PostEntity> {

    constructor(private dataSource: DataSource) {
        super(PostEntity, dataSource.createEntityManager());
    }

    async findAll(userId: string): Promise<PostEntity[] | null> {
        const posts = await this.find({ where: { user: { id: userId } } });

        if (!posts) return null;

        return posts;
    }

    async findById(id: string): Promise<PostEntity | null> {
        const post = await this.findOne({ where: { id: id }, relations: ['user'] });

        if (!post) return null;

        return post;
    }

    async createPost(createPostDTO: CreatePostDTO, userId: string): Promise<PostEntity | null> {
        const newPost = this.create({
            name: createPostDTO.name,
            description: createPostDTO.description,
            user: { id: userId }
        });

        const savePost = await this.save(newPost);

        if(!savePost) return null;

        return savePost;
    }

    async updatePost(updatePostDTO: UpdatePostDTO): Promise<PostEntity | null> {
        const updatePost = await this.save(updatePostDTO);

        if(!updatePost) return null;
        
        return updatePost;
    }

    async softDeletePost(id: string): Promise<boolean> {
        const affectedRows = await this.delete(id);

        if(affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }
}