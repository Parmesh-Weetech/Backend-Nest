import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { OrganizationService } from '../organization/organization.service';
import { PermissionService } from '../permission/permission.service';

import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { type IRoleRepository, ROLE_REPOSITORY } from './role.repository.interface';

@Injectable()
export class RoleService {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,

        @Inject(forwardRef(() => PermissionService))
        private readonly permissionService: PermissionService,

        private readonly organizationService: OrganizationService,
    ) { }

    private readonly isMongoProvider =
        ['mongo', 'mongodb'].includes((process.env.DATABASE_PROVIDER ?? '').toLowerCase());

    async findAll(): Promise<APIResponse> {
        const roles = await this.roleRepository.findAll();
        if (!roles) throw new NotFoundException('No roles found.');

        return {
            success: true,
            expired: false,
            message: "Roles fetched successfully.",
            data: roles,
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
        const existingRoles = await this.roleRepository.findByKeyAndOrganization(roleDTO.key, orgId);

        if (existingRoles.length > 0) {
            throw new ConflictException('Role already exists in this organization.');
        }

        const permissions = await Promise.all(
            roleDTO.permissionIds.map((permissionId) => this.permissionService.findOne(permissionId)),
        );

        const savedRole = await this.roleRepository.create({
            key: roleDTO.key,
            label: roleDTO.label,
            description: roleDTO.description,
            ...(this.isMongoProvider
                ? {
                    organization: organization.data.id,
                    permissionIds: roleDTO.permissionIds,
                }
                : {
                    organization: { id: organization.data.id },
                    permissions: permissions.map((permission) => ({ id: permission.data.id })),
                }),
        });
        if (!savedRole) throw new InternalServerErrorException('Failed to create role.');

        return {
            statusCode: 201,
            success: true,
            data: savedRole,
            expired: false,
            message: "Role created successfully."
        }
    }

    async update(dto: UpdateRoleDTO): Promise<APIResponse> {
        const roleResponse = await this.findOne(dto.id);

        const role = roleResponse.data;

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

        const updatedRole = await this.roleRepository.update(dto.id, {
            key: dto.key,
            label: dto.label,
            description: dto.description,
            ...(this.isMongoProvider
                ? {
                    permissionIds: dto.permissionIds,
                    organization: dto.organizationIds?.[0],
                }
                : {
                    ...(dto.permissionIds
                        ? { permissions: dto.permissionIds.map((permissionId) => ({ id: permissionId })) }
                        : {}),
                    ...(dto.organizationIds?.[0]
                        ? { organization: { id: dto.organizationIds[0] } }
                        : {}),
                }),
        });
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

        const deletedRows = await this.roleRepository.softDelete(id);
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
        const role = await this.roleRepository.findGlobalRoleByKey(key);
        if (!role) throw new NotFoundException('Role not found.');

        const roleData = role as any;
        if (
            roleData.permissions === undefined &&
            Array.isArray(roleData.permissionIds) &&
            roleData.permissionIds.length > 0
        ) {
            const validPermissionIds = roleData.permissionIds
                .map((permissionId: any) => String(permissionId ?? ''))
                .filter((permissionId: string) => permissionId && permissionId !== 'undefined');

            const permissions = await Promise.all(
                validPermissionIds.map((permissionId: string) =>
                    this.permissionService.findOne(permissionId).then((response) => response.data),
                ),
            );
            roleData.permissions = permissions;
        }

        return {
            success: true,
            message: "Role fetched successfully.",
            data: roleData,
            expired: false,
            statusCode: 200
        };
    }

    async findByOrgAndRole(roleId: string): Promise<APIResponse> {
        const role = await this.roleRepository.findById(roleId);

        if(!role) return {
            success: true,
            data: null,
            expired: false,
            message: "No Role Organization Mapping is there",
            statusCode: 200
        }


        return {
            success: true,
            data: role,
            message: "Role Organization Mapping is there",
            expired: false,
            statusCode: 200
        }
    }

    async createDummyEntryWithOrg(orgId: string, role: any): Promise<APIResponse> {
        const newRole = await this.roleRepository.createDummyEntryWithOrg(orgId, role);

        if(!newRole) return {
            success: false,
            data: null,
            expired: false,
            message: "Error while creating dummy entry",
            statusCode: 500
        }

        return {
            success: true,
            data: newRole,
            expired: false,
            message: "New dummy role created successfully",
            statusCode: 201
        }
    }

    async findRoleByOrg(orgId: string, roleId: string): Promise<APIResponse> {
        const role = await this.roleRepository.findRoleByOrg(orgId, roleId);

        if(!role || role === null) {
            return {
                success: false,
                expired: false,
                data: null,
                message: "Role not found",
                statusCode: 404
            }
        }

        return {
            success: true,
            data: role,
            expired: false,
            message: "Role fetched successfully",
            statusCode: 200
        }
    }
}
