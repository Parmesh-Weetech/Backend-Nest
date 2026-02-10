import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APIResponse } from '../common/response/response.dto';
import { OrganizationService } from '../organization/organization.service';

import { UpdatePermissionDTO } from './dtos/update-permission.dto';
import { CreatePermissionDTO } from './dtos/create-permission.dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionRepository)
        private readonly permissionRepository: PermissionRepository,

        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<APIResponse> {
        const permissions = await this.permissionRepository.findAll();
        if (!permissions) throw new InternalServerErrorException('Something went wrong while fetching permissions.');

        return {
            success: true,
            message: "Permissions fetched successfully.",
            data: permissions.length > 0 ? permissions : [],
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

    async create(dto: CreatePermissionDTO, orgId: string): Promise<APIResponse> {
        const organization = await this.organizationService.findOne(orgId);

        const existingPermissions = await this.permissionRepository.findOne({ where: { entity: dto.entity, action: dto.action, organization: organization.data } });
        if (existingPermissions) throw new ForbiddenException("Permission already exists!");

        const permission = this.permissionRepository.createPermission(dto, organization.data)
        if (!permission) throw new InternalServerErrorException('Failed to create permission');

        return {
            success: true,
            expired: false,
            message: "Permission created successfully.",
            statusCode: 201,
            data: permission
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

        const updatedPermission = await this.permissionRepository.updatePermission(perm.data);
        if (!updatedPermission) throw new InternalServerErrorException('Failed to update permission');

        return {
            success: true,
            message: "Permission updated successfully.",
            statusCode: 200,
            data: updatedPermission,
            expired: false
        }
    }

    async remove(id: string): Promise<APIResponse> {
        await this.findOne(id);

        const response = await this.permissionRepository.softDeletePermission(id);

        if (!response)
            throw new InternalServerErrorException("Error while deleting permission.")

        return {
            success: true,
            message: "Permission deleted successfully.",
            expired: false,
            data: response,
            statusCode: 200
        }
    }
}
