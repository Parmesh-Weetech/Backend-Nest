import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        if (!organization) {
            throw new NotFoundException("Organization not found.");
        }

        const requestedPermissions = await Promise.all(
            dto.permissionIds.map(id => this.permissionService.findOne(id))
        );

        const requestedSignature = requestedPermissions
            .map(p => `${p.entity}:${p.action}`)
            .sort()
            .join('|');

        const existingRoles = await this.roleRepository.find({
            where: {
                key: dto.key,
                organization: { id: orgId }
            },
            relations: ['permissions']
        });

        for (const role of existingRoles) {
            const existingSignature = role.permissions
                .map(p => `${p.entity}:${p.action}`)
                .sort()
                .join('|');

            if (existingSignature === requestedSignature) {
                throw new ConflictException(
                    `Role "${dto.key}" with same effective permissions already exists.`
                );
            }
        }

        // 4️⃣ Create role (safe)
        const role = this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            organization,
            permissions: requestedPermissions
        });

        return await this.roleRepository.save(role);
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
