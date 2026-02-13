import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video } from '../video/entities/video.entity';
import { IVideoRepository } from './video.interface.repository';

@Injectable()
export class PostgresVideoRepository implements IVideoRepository {
    constructor(
        @InjectRepository(Video)
        private readonly repo: Repository<Video>,
    ) { }

    async create(data: Partial<Video>): Promise<Video> {
        return this.repo.create(data);
    }

    async save(video: Partial<Video>): Promise<Video> {
        return this.repo.save(video);
    }

    async findById(id: string): Promise<Video | null> {
        return this.repo.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<Video>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
