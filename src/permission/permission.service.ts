import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { OrganizationService } from '../organization/organization.service';
import { DatabaseResolver } from '../common/resolvers/database.resolver';

import { UpdatePermissionDTO } from './dtos/update-permission.dto';
import { CreatePermissionDTO } from './dtos/create-permission.dto';
import { type IPermissionRepository, PERMISSION_REPOSITORY } from './permission.repository.interface';

@Injectable()
export class PermissionService {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
        private readonly organizationService: OrganizationService,
        private readonly databaseResolver: DatabaseResolver,
    ) { }

    private get isMongoProvider() {
        return this.databaseResolver.provider === 'mongodb';
    }

    async findAll(): Promise<APIResponse> {
        const permissions = await this.permissionRepository.findAll();

        if (!permissions) throw new NotFoundException('No permissions found.');

        return {
            success: true,
            message: "Permissions fetched successfully.",
            data: permissions,
            expired: false,
            statusCode: 200
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const perm = await this.permissionRepository.findById(id);
        if (!perm) throw new NotFoundException('Permission not found.');

        return {
            success: true,
            message: "Permission fetched successfully.",
            data: perm,
            expired: false,
            statusCode: 200
        };;
    }

    async create(
        dto: CreatePermissionDTO,
        orgId: string,
        options?: { allowExisting?: boolean },
    ): Promise<APIResponse> {

        await this.organizationService.findOne(orgId);

        const existingPermission = await this.permissionRepository.findByPermissionAndOrg(dto.key, dto.label, dto.entity, dto.action, orgId);
        if (existingPermission) {
            if (options?.allowExisting) {
                return {
                    success: true,
                    expired: false,
                    message: "Permission already exists in this organization.",
                    statusCode: 200,
                    data: existingPermission,
                };
            }

            throw new ConflictException('Permission already exists in this organization.');
        }

        const newPermission =
            await this.permissionRepository.create({
                ...dto,
                organization: this.isMongoProvider ? orgId : { id: orgId },
            });
        if (!newPermission) throw new InternalServerErrorException('Failed to create permission');

        return {
            success: true,
            expired: false,
            message: "Permission created successfully.",
            statusCode: 201,
            data: newPermission
        }
    }

    async update(dto: UpdatePermissionDTO): Promise<APIResponse> {
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

        const updatedPermission =
            await this.permissionRepository.update(dto.id, dto);
        if (!updatedPermission) throw new InternalServerErrorException('Failed to update permission');

        return {
            success: true,
            message: "Permission updated successfully.",
            statusCode: 200,
            data: perm.data,
            expired: false
        }
    }

    async remove(id: string): Promise<APIResponse> {
        await this.findOne(id);

        const response = await this.permissionRepository.softDelete(id);

        if (!response)
            throw new InternalServerErrorException("Error while deleting permission.")

        return {
            success: true,
            message: "Permission deleted successfully.",
            expired: false,
            data: null,
            statusCode: 200
        }
    }

    async findByRoleId(roleId: string): Promise<APIResponse> {
        const permissions = await this.permissionRepository.findByRoleId(roleId);

        if (permissions.length === 0 || !permissions)
            throw new NotFoundException('No permissions found for the given role ID.');

        return {
            success: true,
            message: "Permission fetched successfully",
            statusCode: 200,
            data: permissions,
            expired: false
        }
    }

    async findGlobalPermissionByKey(key: string): Promise<APIResponse> {
        const permission = await this.permissionRepository.findGlobalPermissionByKey(key);

        if (!permission) throw new NotFoundException('Role not found.');

        return {
            success: true,
            message: "Role fetched successfully.",
            data: permission,
            expired: false,
            statusCode: 200
        };
    }
}
