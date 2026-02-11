import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { CreateRoleDTO } from "./dtos/create-role.dto";
import { Organization } from "src/organization/entities/organization.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { UpdateRoleDTO } from "./dtos/update-role.dto";

@Injectable()
export class RoleRepository extends Repository<Role> {

    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
    }

    async findAll(): Promise<Role[] | [] | null> {
        const roles = await this.find({ relations: ['permissions'] });

        if (roles.length === 0) return [];

        if (!roles) return null;

        return roles;
    }

    async findById(id: string): Promise<Role | null> {
        const role = await this.findOne({ where: { id }, relations: ['organization', 'permissions'] });

        if (!role) return null;

        return role;
    }

    async findByRoleKey(key: string, orgId: string | null = null): Promise<Role[] | [] | null> {
        const roles = await this.find({
            where: orgId
                ? { key: key, organization: { id: orgId } }
                : { key: key },
            relations: ['permissions']
        });

        if (roles.length === 0) return [];

        if (!roles) return null;

        return roles;
    }

    async createRole(roleDTO: CreateRoleDTO, organization: Organization, permissions: Permission[]): Promise<Role | null> {
        const newRole = this.create({
            key: roleDTO.key,
            label: roleDTO.label,
            description: roleDTO.description,
            organization: organization,
            permissions: permissions
        });

        const saveRole = await this.save(newRole);

        if(!saveRole) return null;

        return saveRole;
    }

    async updateRole(role: UpdateRoleDTO): Promise<Role | null> {
        const updateRole = await this.save(role);

        if(!updateRole) return null;

        return updateRole;
    }

    async softDeleteRole(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete(id);

        if(affectedRows.affected === undefined || affectedRows.affected === null || affectedRows.affected === 0) return false;

        return true;
    }
}