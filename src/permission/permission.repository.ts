import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { CreatePermissionDTO } from "./dtos/create-permission.dto";
import { Organization } from "../organization/entities/organization.entity";
import { UpdatePermissionDTO } from "./dtos/update-permission.dto";

@Injectable()
export class PermissionRepository extends Repository<Permission> {

    constructor(private dataSource: DataSource) {
        super(Permission, dataSource.createEntityManager());
    }

    async findAll(): Promise<Permission[] | [] | null> {
        const permission = await this.find();

        if (!permission) return null;

        if (permission.length === 0) return [];

        return permission;
    }

    async findById(id: string): Promise<Permission | null> {
        const permission = await this.findOne({ where: { id }, relations: ['roles'] });

        if (!permission) return null;

        return permission
    }

    async createPermission(createPermissionDTO: CreatePermissionDTO, organization: Organization): Promise<Permission | null> {
        const newPermission = this.create({
            key: createPermissionDTO.key,
            label: createPermissionDTO.label,
            description: createPermissionDTO.description,
            entity: createPermissionDTO.entity,
            action: createPermissionDTO.action,
            organization: organization
        });

        const savePermission = await this.save(newPermission);

        if(!savePermission) return null;

        return savePermission;
    }

    async updatePermission(updatePermissionDTO: UpdatePermissionDTO): Promise<Permission | null> {
        const updatePermission = await this.save(updatePermissionDTO);

        if(!updatePermission) return null;

        return updatePermission;
    }

    async softDeletePermission(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete(id);

        if(affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }
}