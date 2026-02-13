import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Organization } from './entities/organization.entity';
import { IOrganizationRepository } from './organization.repository.interface';

@Injectable()
export class PostgresOrganizationRepository
    implements IOrganizationRepository {
    constructor(
        @InjectRepository(Organization)
        private readonly repo: Repository<Organization>,
    ) { }

    async findAllByUser(userId: string) {
        return this.repo.find({
            where: { users: In([userId]) },
            relations: ['users'],
        });
    }

    async findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    async create(data: any) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async update(id: string, data: Partial<Organization>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async softDelete(id: string) {
        const res = await this.repo.softDelete(id);
        return !!res.affected;
    }
}
