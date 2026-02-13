import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { IPostRepository } from './post.repository.interface';

@Injectable()
export class PostgresPostRepository implements IPostRepository {
    constructor(
        @InjectRepository(PostEntity)
        private readonly repo: Repository<PostEntity>,
    ) { }

    async create(data: any) {
        const post = this.repo.create(data);
        return this.repo.save(post);
    }

    async findAll(userId: string) {
        return this.repo.find({ where: { user: { id: userId } }, relations: ['user'] });
    }

    async findOne(id: string) {
        return this.repo.findOne({ where: { id }, relations: ['user'] });
    }

    async update(id: string, data: any) {
        await this.repo.update({ id }, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        const result = await this.repo.softDelete(id);

        if(result.affected === undefined || result.affected === null || result.affected === 0) return false;

        return result.affected > 0;
    }
}
