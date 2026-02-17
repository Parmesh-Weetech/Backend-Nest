import { Injectable } from "@nestjs/common";
import { IPermissionRepository } from "./permission.repository.interface";
import { Permission } from "./entities/permission.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostgresPermissionRepository
    implements IPermissionRepository {
    constructor(
        @InjectRepository(Permission)
        private readonly repo: Repository<Permission>,
    ) { }

    findAll() {
        return this.repo.find({ relations: ['roles'] });
    }

    findById(id: string) {
        return this.repo.findOne({
            where: { id },
            relations: ['roles'],
        });
    }

    findByEntityAndOrg(entity: string, organizationId: string) {
        return this.repo.findOne({
            where: {
                entity: entity,
                organization: { id: organizationId },
            },
        });
    }

    findByPermissionAndOrg(key: string, label: string, entity: string, action: string, organizationId: string) {
        return this.repo.findOne({
            where: {
                key,
                label,
                entity,
                action,
                organization: { id: organizationId },
            },
        });
    }

    async create(data: any) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async update(id: string, data: Partial<Permission>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }

    async softDelete(id: string) {
        const res = await this.repo.softDelete(id);
        return !!res.affected;
    }

    findByRoleId(roleId: string) {
        return this.repo
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('role.id = :roleId', { roleId })
            .getMany();
    }
}
