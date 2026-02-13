import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';

import { Files } from './entities/File.entity';
import { IFilesRepository } from './files.repository.interface';

@Injectable()
export class PostgresFilesRepository implements IFilesRepository {
    constructor(
        @InjectRepository(Files)
        private readonly repo: Repository<Files>,
    ) { }

    async create(data: any) {
        const file = this.repo.create(data);
        return this.repo.save(file);
    }

    async findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    async findByIdWithUser(id: string) {
        return this.repo.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async findByUser(userId: string) {
        return this.repo.find({
            where: {
                user: { id: userId },
                status: Not(In(['ORPHAN', 'PENDING'])),
            },
            relations: ['user'],
        });
    }

    async update(id: string, data: any) {
        await this.repo.update({ id }, data);
        return this.findById(id);
    }

    async delete(id: string) {
        const result = await this.repo.delete(id);
        return !!result.affected;
    }
}
