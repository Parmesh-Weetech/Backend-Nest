import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private readonly organizationService: OrganizationService,
        @Inject(forwardRef(() => PermissionService))
        private readonly permissionService: PermissionService
    ) { }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['organization', 'permissions'] });

        if (!role) throw new NotFoundException("Role not found.")

        return role;
    }

    async create(dto: CreateRoleDTO, orgId: string): Promise<Role> {
        const organization = await this.organizationService.findOne(orgId);

        if (!orgId || !organization) {
            throw new NotFoundException("Organization not found.");
        }

        // 1️⃣ Fetch all permissions from DTO
        const permissions = await Promise.all(
            dto.permissionIds.map(permissionId => this.permissionService.findOne(permissionId))
        );

        // 2️⃣ Check if a role with same key AND same permissions exists in this org
        const existingRoles = await this.roleRepository.find({
            where: { key: dto.key, organization: { id: orgId } },
            relations: ['permissions']
        });

        for (const existingRole of existingRoles) {
            const existingPermissionIds = existingRole.permissions.map(p => p.id).sort();
            const newPermissionIds = permissions.map(p => p.id).sort();

            const isSamePermissions =
                existingPermissionIds.length === newPermissionIds.length &&
                existingPermissionIds.every((id, index) => id === newPermissionIds[index]);

            if (isSamePermissions) {
                throw new ConflictException(
                    `Role with key "${dto.key}" and same permissions already exists in this organization.`
                );
            }
        }

        // 3️⃣ Create new role if no duplicate
        const role = this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            organization: organization,
            permissions: permissions
        });

        const newRole = await this.roleRepository.save(role);

        if (!newRole) {
            throw new InternalServerErrorException("Internal server error while creating role");
        }

        return newRole;
    }


    async update(dto: UpdateRoleDTO): Promise<Role> {
        const role = await this.findOne(dto.id);

        if (!role) throw new NotFoundException("Role not found")

        if (dto.key) role.key = dto.key;
        if (dto.label) role.label = dto.label;
        if (dto.description) role.description = dto.description;

        return this.roleRepository.save(role);
    }

    async delete(id: string): Promise<void> {
        await this.roleRepository.softDelete(id);
    }

    async findRoleByKey(key: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { key: key } });

        if (!role) throw new NotFoundException("Role not found.");

        return role;
    }

    async findRoleByOrganization(key: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { key: key, organization: IsNull() }, relations: ['permissions'] });

        if (!role) throw new NotFoundException("Role not found.");

        return role;
    }
}
