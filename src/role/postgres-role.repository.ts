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

    async findByIdAndOrganizationIsNull(id: string) {
        const role = await this.repo.findOne({
            where: { id: id, organization: { id: IsNull() } },
        });

        return role;
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
        const role = await this.findById(id);
        if (!role) return null;

        Object.assign(role, data);
        await this.repo.save(role);

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

    createDummyEntryWithOrg(orgId: string, role: any): Promise<any> {
        const newRole = this.repo.save({
            id: role.data.id,
            key: role.data.key,
            description: role.data.description,
            label: role.data.label,
            organization: { id: orgId },
        });

        return newRole;
    }

    findRoleByOrg(orgId: string, roleId: string): Promise<any> {
        const role = this.repo.findOne({
            where: { id: roleId, organization: { id: orgId }},
            relations: ['permissions', 'organization']
        })
        
        return role;
    }
}
