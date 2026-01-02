import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { RoleService } from '../role/role.service.js';
import { Role } from '../role/entities/role.entity.js';
import { OrganizationService } from '../organization/organization.service.js';

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
        return this.permissionRepository.find({ relations: ['roles'] });
    }

    async findOne(id: string): Promise<Permission> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });

        if (!perm) throw new NotFoundException("Permission not found.");

        return perm;
    }

    async create(dto: CreatePermissionDTO, orgId: string): Promise<Permission> {
        const organization = await this.organizationService.findOne(orgId);

        if (!organization) throw new NotFoundException("Organization not found.");

        const existingPermissions = await this.permissionRepository.findOne({ where: { entity: dto.entity, action: dto.action, organization: { id: orgId }}});

        console.log(existingPermissions)

        if(existingPermissions) throw new ForbiddenException("Permission already exists!");

        const permission = this.permissionRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            entity: dto.entity,
            action: dto.action,
            organization: organization
        });

        return await this.permissionRepository.save(permission);
    }

    async update(dto: UpdatePermissionDTO): Promise<Permission> {
        const perm = await this.findOne(dto.id);

        if (!perm) throw new NotFoundException("Permission not found.");

        if (dto.key) perm.key = dto.key;
        if (dto.label) perm.label = dto.label;
        if (dto.description) perm.description = dto.description;
        if (dto.entity) perm.entity = dto.entity;
        if (dto.action) perm.action = dto.action;

        if (dto.roleIds && dto.roleIds.length > 0) {
            const existingRoles = await Promise.all(
                dto.roleIds.map(roleId => this.roleService.findOne(roleId))
            );

            if (!existingRoles) {
                throw new NotFoundException("One or more roles do not exist!");
            }

            perm.roles = existingRoles as Role[];
        }

        return this.permissionRepository.save(perm);
    }

    async delete(id: string): Promise<void> {
        await this.permissionRepository.softDelete(id);
    }

    async findByRoleId(roleId: string): Promise<Permission[]> {
        return await this.permissionRepository
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('role.id = :roleId', { roleId })
            .getMany();
    }
}
