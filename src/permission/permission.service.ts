import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { RoleService } from '../role/role.service.js';
import { Role } from '../role/entities/role.entity.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionCreationFailedError, PermissionDeletionFailedError, PermissionUpdationFailedError } from './errors/errors.js';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<Permission[]> {
        const permissions = this.permissionRepository.find({ relations: ['roles'] });

        if (!permissions) throw new NotFoundException("Permissions not found.");

        return permissions;
    }

    async findOne(id: string): Promise<Permission> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });

        if (!perm) throw new NotFoundException("Permission not found.");

        return perm;
    }

    async create(dto: CreatePermissionDTO, orgId: string): Promise<Permission> {
        const organization = await this.organizationService.findOne(orgId);

        const existingPermissions = await this.permissionRepository.findOne({ where: { entity: dto.entity, action: dto.action, organization: { id: orgId } } });

        if (existingPermissions) throw new ForbiddenException("Permission already exists!");

        try {
            const permission = this.permissionRepository.create({
                key: dto.key,
                label: dto.label,
                description: dto.description,
                entity: dto.entity,
                action: dto.action,
                organization: organization
            });

            return await this.permissionRepository.save(permission);
        } catch (error) {
            throw new PermissionCreationFailedError();
        }
    }

    async update(dto: UpdatePermissionDTO): Promise<Permission> {
        const perm = await this.findOne(dto.id);

        if (dto.key) perm.key = dto.key;
        if (dto.label) perm.label = dto.label;
        if (dto.description) perm.description = dto.description;
        if (dto.entity) perm.entity = dto.entity;
        if (dto.action) perm.action = dto.action;

        if (dto.organizationIds && dto.organizationIds.length > 0) {
            const existingOrganization = await Promise.all(
                dto.organizationIds.map(orgId => this.organizationService.findOne(orgId))
            );

            existingOrganization.map(org => {
                perm.organization = org;
            });
        }

        try {
            return this.permissionRepository.save(perm);
        } catch (error) {
            throw new PermissionUpdationFailedError();
        }
    }

    async delete(id: string): Promise<void> {
        const perm = await this.findOne(id);

        try {
            await this.permissionRepository.softDelete(id);
        } catch (error) {
            throw new PermissionDeletionFailedError();
        }
    }

    async findByRoleId(roleId: string): Promise<Permission[]> {
        return await this.permissionRepository
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('role.id = :roleId', { roleId })
            .getMany();
    }
}
