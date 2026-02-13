import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { IRoleRepository } from "./role.repository.interface";

@Injectable()
export class PostgresRoleRepository implements IRoleRepository {
    constructor(
        @InjectRepository(Role)
        private readonly repo: Repository<Role>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['permissions'] });
    }

    findById(id: string) {
        return this.repo.findOne({
            where: { id },
            relations: ['organization', 'permissions'],
        });
    }

    findByKeyAndOrganization(key: string, organizationId: string) {
        return this.repo.find({
            where: {
                key,
                organization: { id: organizationId },
            },
            relations: ['permissions'],
        });
    }

    async create(data: any) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async update(id: string, data: Partial<Role>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async softDelete(id: string) {
        const result = await this.repo.softDelete(id);
        return !!result.affected;
    }

    findGlobalRoleByKey(key: string) {
        return this.repo.findOne({
            where: {
                key,
                organization: IsNull(),
            },
            relations: ['permissions'],
        });
    }
}
