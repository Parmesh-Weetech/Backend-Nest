import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { OrganizationService } from '../organization/organization.service';
import { PermissionService } from '../permission/permission.service';

import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository,

        @Inject(forwardRef(() => PermissionService))
        private readonly permissionService: PermissionService,

        private readonly organizationService: OrganizationService,
    ) { }

    async findAll(): Promise<APIResponse> {
        const roles = await this.roleRepository.findAll();
        if (!roles) throw new NotFoundException('No roles found.');

        return {
            success: true,
            expired: false,
            message: "Roles fetched successfully.",
            data: roles.length > 0 ? roles : [],
            statusCode: 200
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const role = await this.roleRepository.findById(id);
        if (!role) throw new NotFoundException('Role not found.');

        return {
            success: true,
            message: "Role found successfully",
            expired: false,
            data: role,
            statusCode: 200
        };
    }

    async create(roleDTO: CreateRoleDTO, orgId: string): Promise<APIResponse> {
        const organization = await this.organizationService.findOne(orgId);

        const requestedPermissions = await Promise.all(
            roleDTO.permissionIds.map(id => this.permissionService.findOne(id))
        );

        const requestedSignature = requestedPermissions
            .map(p => `${p.data.entity}:${p.data.action}`)
            .sort()
            .join('|');

        const existingRoles = await this.roleRepository.findByRoleKey(roleDTO.key, orgId);
        if (!existingRoles) throw new InternalServerErrorException({ message: "Something went wrong while fetching roles!" });

        for (const role of existingRoles) {
            const existingSignature = role.permissions
                .map(p => `${p.entity}:${p.action}`)
                .sort()
                .join('|');

            if (existingSignature === requestedSignature) {
                throw new ConflictException(
                    `Role "${roleDTO.key}" with same effective permissions already exists.`
                );
            }
        }

        const permissions = requestedPermissions.map(p => p.data);

        const role = await this.roleRepository.createRole(roleDTO, organization.data, permissions);
        if (!role) throw new InternalServerErrorException('Failed to create role.');

        return {
            statusCode: 201,
            success: true,
            data: role,
            expired: false,
            message: "Role created successfully."
        }
    }

    async update(dto: UpdateRoleDTO): Promise<APIResponse> {
        const existingRoles = await this.findOne(dto.id);
        const role = existingRoles.data;

        if (dto.key) role.key = dto.key;
        if (dto.label) role.label = dto.label;
        if (dto.description) role.description = dto.description;

        if (dto.permissionIds && dto.permissionIds.length > 0) {
            const existingPermissions = await Promise.all(
                dto.permissionIds.map(permissionId => this.permissionService.findOne(permissionId))
            );

            role.permissions = existingPermissions.map(p => p.data);
        }

        if (dto.organizationIds && dto.organizationIds.length > 0) {
            const existingOrganization = await Promise.all(
                dto.organizationIds.map(orgId => this.organizationService.findOne(orgId))
            );

            if (existingOrganization.length > 0) {
                role.organization = existingOrganization[0].data;
            }
        }

        const updatedRole = await this.roleRepository.updateRole(role);
        if (!updatedRole) throw new InternalServerErrorException('Failed to update role.');

        return {
            statusCode: 200,
            success: true,
            data: updatedRole,
            expired: false,
            message: "Role updated successfully."
        };
    }

    async remove(id: string): Promise<APIResponse> {
        await this.findOne(id);

        const deletedRows = await this.roleRepository.softDeleteRole(id);
        if (!deletedRows) throw new InternalServerErrorException('Failed to delete role.');

        return {
            success: true,
            data: null,
            expired: false,
            message: "Role deleted successfully.",
            statusCode: 200
        }
    }

    async findRoleByOrganizationName(key: string): Promise<APIResponse> {
        const role = await this.roleRepository.findByRoleKey(key, null);
        if (!role) throw new NotFoundException('Role not found.');

        return {
            success: true,
            message: "Role fetched successfully.",
            data: role,
            expired: false,
            statusCode: 200
        };
    }
}
