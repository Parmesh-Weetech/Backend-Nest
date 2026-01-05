import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';
import { RoleCreationFailedError, RoleDeletionFailedError, RoleUpdationFailedError } from './errors/errors.js';

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
        const roles = await this.roleRepository.find({ relations: ['permissions'] });

        if (!roles) throw new NotFoundException("Roles not found.");

        return roles;
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['organization', 'permissions'] });

        if (!role) throw new NotFoundException("Role not found.")

        return role;
    }

    async create(dto: CreateRoleDTO, orgId: string): Promise<Role> {
        const organization = await this.organizationService.findOne(orgId);

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

        try {
            const role = this.roleRepository.create({
                key: dto.key,
                label: dto.label,
                description: dto.description,
                organization,
                permissions: requestedPermissions
            });

            return await this.roleRepository.save(role);
        } catch (error) {
            throw new RoleCreationFailedError();
        }
    }

    async update(dto: UpdateRoleDTO): Promise<Role> {
        const role = await this.findOne(dto.id);

        if (dto.key) role.key = dto.key;
        if (dto.label) role.label = dto.label;
        if (dto.description) role.description = dto.description;

        if (dto.permissionIds && dto.permissionIds.length > 0) {
            const existingPermissions = await Promise.all(
                dto.permissionIds.map(permissionId => this.permissionService.findOne(permissionId))
            );

            role.permissions = existingPermissions;
        }

        if (dto.organizationIds && dto.organizationIds.length > 0) {
            const existingOrganization = await Promise.all(
                dto.organizationIds.map(orgId => this.organizationService.findOne(orgId))
            );

            existingOrganization.map(org => {
                role.organization = org;
            });
        }

        try {

            return this.roleRepository.save(role);
        } catch (error) {
            throw new RoleUpdationFailedError();
        }
    }

    async delete(id: string): Promise<void> {
        const role = await this.findOne(id);

        try {
            await this.roleRepository.softDelete(id);
        } catch (error) {
            throw new RoleDeletionFailedError();
        }
    }

    async findRoleByOrganization(key: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { key: key, organization: IsNull() }, relations: ['permissions'] });

        if (!role) throw new NotFoundException("Role not found.");

        return role;
    }
}
