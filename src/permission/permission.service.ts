import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionCreationFailedError, PermissionDeletionFailedError, PermissionUpdationFailedError } from './errors/errors.js';
import { Response } from '../common/response/response.dto.js';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<Response> {
        const permissions = await this.permissionRepository.find({ relations: ['roles'] });

        if (!permissions) return {
            success: false,
            message: "Permissions not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Permissions fetched successfully.",
            data: permissions,
            expired: false,
            statusCode: 200
        };
    }

    async findOne(id: string): Promise<Response> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });

        if (!perm) return {
            success: false,
            message: "Permission not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Permission fetched successfully.",
            data: perm,
            expired: false,
            statusCode: 200
        };;
    }

    async create(dto: CreatePermissionDTO, orgId: string): Promise<Response> {
        const organization = await this.organizationService.findOne(orgId);

        const existingPermissions = await this.permissionRepository.findOne({ where: { entity: dto.entity, action: dto.action, organization: { id: orgId } } });

        if (existingPermissions) throw new Error("Permission already exists!");

        try {
            const permission = this.permissionRepository.create({
                key: dto.key,
                label: dto.label,
                description: dto.description,
                entity: dto.entity,
                action: dto.action,
                organization: organization.data
            });

            const newPermission = await this.permissionRepository.save(permission);

            return {
                success: true,
                expired: false,
                message: "Permission created successfully.",
                statusCode: 201,
                data: newPermission
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null,
                statusCode: 500,
                expired: false,
            }
        }
    }

    async update(dto: UpdatePermissionDTO): Promise<Response> {
        const perm = await this.findOne(dto.id);

        if (dto.key) perm.data.key = dto.key;
        if (dto.label) perm.data.label = dto.label;
        if (dto.description) perm.data.description = dto.description;
        if (dto.entity) perm.data.entity = dto.entity;
        if (dto.action) perm.data.action = dto.action;

        if (dto.organizationIds && dto.organizationIds.length > 0) {
            const existingOrganization = await Promise.all(
                dto.organizationIds.map(orgId => this.organizationService.findOne(orgId))
            );

            existingOrganization.map(org => {
                perm.data.organization = org;
            });
        }

        try {
            await this.permissionRepository.save(perm.data);

            return {
                success: true,
                message: "Permission updated successfully.",
                statusCode: 200,
                data: perm.data,
                expired: false
            }
        } catch (error) {
            return {
                success: false,
                expired: false,
                statusCode: 500,
                message: error.message,
                data: null
            }
        }
    }

    async delete(id: string): Promise<Response> {
        const perm = await this.findOne(id);

        if (!perm.data) return perm;

        try {
            const response = await this.permissionRepository.softDelete(id);

            if (response.affected === undefined && response.affected === null && response.affected === 0) {
                throw new Error("Error while deleting permission.")
            }

            return {
                success: true,
                message: "Permission deleted successfully.",
                expired: false,
                data: response.raw,
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                expired: false,
                message: error.message,
                data: null,
                statusCode: 500
            }
        }
    }

    async findByRoleId(roleId: string): Promise<Response> {
        const permissions = await this.permissionRepository
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('role.id = :roleId', { roleId })
            .getMany();

        if (permissions.length > 0) {
            return {
                success: true,
                message: "Permission fetched successfully",
                statusCode: 200,
                data: permissions,
                expired: false
            }
        }

        return {
            success: false,
            message: "Error while fetching permisions",
            statusCode: 500,
            data: null,
            expired: false
        }
    }
}
