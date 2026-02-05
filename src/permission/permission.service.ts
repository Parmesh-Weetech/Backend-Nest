import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { OrganizationService } from '../organization/organization.service';

import { Permission } from './entities/permission.entity';
import { UpdatePermissionDTO } from './dtos/update-permission.dto';
import { CreatePermissionDTO } from './dtos/create-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<APIResponse> {
        const permissions = await this.permissionRepository.find({
            relations: ['roles']
        });
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
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });
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

        const permission = this.permissionRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            entity: dto.entity,
            action: dto.action,
            organization: organization.data
        });

        const newPermission = await this.permissionRepository.save(permission);
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

        const updatedPermission = await this.permissionRepository.save(perm.data);
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

        if (response.affected === undefined && response.affected === null && response.affected === 0)
            throw new InternalServerErrorException("Error while deleting permission.")

        return {
            success: true,
            message: "Permission deleted successfully.",
            expired: false,
            data: response.raw,
            statusCode: 200
        }
    }

    async findByRoleId(roleId: string): Promise<APIResponse> {
        const permissions = await this.permissionRepository
            .createQueryBuilder('permission')
            .innerJoin('permission.roles', 'role')
            .where('role.id = :roleId', { roleId })
            .getMany();

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
}
