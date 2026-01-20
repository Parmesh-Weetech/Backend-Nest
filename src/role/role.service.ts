import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';
import { Response } from '../common/response/response.dto.js';
import { Auth } from '../common/util/auth.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private readonly organizationService: OrganizationService,
        @Inject(forwardRef(() => PermissionService))
        private readonly permissionService: PermissionService,
        private readonly auth: Auth,
        private readonly userService: UserService
    ) { }

    async findAll(authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const roles = await this.roleRepository.find({ relations: ['permissions'] });

        if (!roles) return {
            success: false,
            expired: false,
            message: "Roles not found.",
            data: null,
            statusCode: 404
        }

        return {
            success: true,
            expired: false,
            message: "Roles fetched successfully.",
            data: roles,
            statusCode: 200
        };
    }

    async findOne(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const role = await this.roleRepository.findOne({ where: { id }, relations: ['organization', 'permissions'] });

        if (!role) return {
            success: false,
            message: "Role not found.",
            expired: false,
            data: null,
            statusCode: 404
        }

        return {
            success: true,
            message: "Role found successfully",
            expired: false,
            data: role,
            statusCode: 200
        };
    }

    async create(dto: CreateRoleDTO, orgId: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const organization = await this.organizationService.findOne(orgId, authorization);

        if(!organization.success) return organization;

        const requestedPermissions = await Promise.all(
            dto.permissionIds.map(id => this.permissionService.findOne(id, authorization))
        );

        const requestedSignature = requestedPermissions
            .map(p => `${p.data.entity}:${p.data.action}`)
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
                throw new Error(
                    `Role "${dto.key}" with same effective permissions already exists.`
                );
            }
        }

        try {
            const role = this.roleRepository.create({
                key: dto.key,
                label: dto.label,
                description: dto.description,
                organization: organization.data,
                permissions: requestedPermissions.map(p => p.data)
            });

            const savedRole = await this.roleRepository.save(role);

            return {
                statusCode: 201,
                success: true,
                data: savedRole,
                expired: false,
                message: "Role created successfully."
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                expired: false,
                data: null,
                statusCode: 500
            }
        }
    }

    async update(dto: UpdateRoleDTO, authorization): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const roleResponse = await this.findOne(dto.id, authorization);

        if (!roleResponse.success) return roleResponse;

        const role = roleResponse.data;

        if (dto.key) role.key = dto.key;
        if (dto.label) role.label = dto.label;
        if (dto.description) role.description = dto.description;

        if (dto.permissionIds && dto.permissionIds.length > 0) {
            const existingPermissions = await Promise.all(
                dto.permissionIds.map(permissionId => this.permissionService.findOne(permissionId, authorization))
            );

            role.permissions = existingPermissions.map(p => p.data);
        }

        if (dto.organizationIds && dto.organizationIds.length > 0) {
            const existingOrganization = await Promise.all(
                dto.organizationIds.map(orgId => this.organizationService.findOne(orgId, authorization))
            );

            if (existingOrganization.length > 0) {
                role.organization = existingOrganization[0].data;
            }
        }

        try {
            const updatedRole = await this.roleRepository.save(role);

            return {
                statusCode: 200,
                success: true,
                data: updatedRole,
                expired: false,
                message: "Role updated successfully."
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                expired: false,
                data: null,
                statusCode: 500
            };
        }
    }

    async remove(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const role = await this.findOne(id, authorization);

        if(!role.success) return role;

        try {
            const deletedRows = await this.roleRepository.softDelete(id);

            if((deletedRows.affected === null || deletedRows.affected === undefined) && deletedRows.affected === 0) {
                return {
                    success: false,
                    statusCode: 400,
                    data: null,
                    expired: false,
                    message: "Role not deleted."
                }
            }

            return {
                success: true,
                data: deletedRows.raw,
                expired: false,
                message: "Role deleted successfully.",
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                data: null,
                expired: false,
                message: error.message
            }
        }
    }

    async findRoleByOrganization(key: string): Promise<Response> {
        const role = await this.roleRepository.findOne({ where: { key: key, organization: IsNull() }, relations: ['permissions'] });

        if (!role) return {
            success: false,
            message: "Role not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Role fetched successfully.",
            data: role,
            expired: false,
            statusCode: 200
        };
    }
}
