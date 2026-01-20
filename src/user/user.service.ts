import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { Response } from '../common/response/response.dto.js';
import { Auth } from '../common/util/auth.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService,
        private readonly auth: Auth
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

        const isUserExists = await this.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const users = await this.userRepository.find({ relations: ['roles'] });

        if (!users) return {
            success: false,
            data: null,
            expired: false,
            message: "Users not found.",
            statusCode: 404
        }

        return {
            success: true,
            data: users,
            expired: false,
            message: "Users fetched successfully.",
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

        const isUserExists = await this.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const user = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'organization'] });
        
        if (!user) return {
            success: false,
            data: null,
            expired: false,
            message: "User not found.",
            statusCode: 404
        }

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async create(createUserDTO: CreateUserDTO, orgId: string, authorization: string): Promise<Response> {
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

        const isUserExists = await this.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const roles = await Promise.all(
            createUserDTO.roleIds.map(roleId =>
                this.roleService.findOne(roleId, authorization),
            ),
        );

        const requiredRoles = roles.map(role => role.data)

        const organization = await this.organizationService.findOne(orgId, authorization);

        if(!organization) return {
            success: false,
            data: null,
            expired: false,
            message: "Organization not found.",
            statusCode: 404
        }
        
        try {
            const newUser = await this.userRepository.create({
                name: createUserDTO.name,
                email: createUserDTO.email,
                password: createUserDTO.password,
                roles: requiredRoles,
                organization: organization.data
            });

            const savedUser = await this.userRepository.save(newUser);

            return {
                success: true,
                data: savedUser,
                expired: false,
                message: "User created successfully.",
                statusCode: 201
            }
        } catch (error) {
            return {
                success: false,
                expired: false,
                data: null,
                message: error.message,
                statusCode: 500
            }
        }
    }

    async update(updateUserDTO: updateUserDTO, authorization: string): Promise<Response> {
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

        const isUserExists = await this.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const user = await this.findOne(updateUserDTO.id, authorization);

        if (updateUserDTO.roleIds) {
            const roles = await Promise.all(
                updateUserDTO.roleIds.map(roleId =>
                    this.roleService.findOne(roleId, authorization),
                ),
            );

            user.data.roles = roles;
        }

        try {
            if (updateUserDTO.name) user.data.name = updateUserDTO.name;
            if (updateUserDTO.email) user.data.email = updateUserDTO.email;
            if (updateUserDTO.password) user.data.password = updateUserDTO.password;


            const savedUser = await this.userRepository.save(user.data);

            return {
                success: true,
                data: savedUser,
                expired: false,
                message: "User updated successfully.",
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                expired: false,
                data: null,
                message: error.message,
                statusCode: 500
            }
        }
    }

    async remove(id: string, authorization): Promise<Response> {
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

        const isUserExists = await this.findOne(decodedPayload.sub, authorization);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const user = await this.findOne(id, authorization);

        try {
            const affectedRows = await this.userRepository.softDelete(user.data.id);

            if((affectedRows.affected === null || affectedRows.affected === undefined) && affectedRows.affected === 0) return {
                success: false,
                data: null,
                expired: false,
                message: "User not deleted.",
                statusCode: 400
            }

            return {
                success: true,
                data: affectedRows,
                expired: false,
                message: "User deleted successfully.",
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                expired: false,
                data: null,
                message: error.message,
                statusCode: 500
            }
        }
    }

    async findOneByEmail(email: string): Promise<Response> {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['roles'] });

        if (!user) return {
            success: false,
            data: null,
            expired: false,
            message: "User not found.",
            statusCode: 404
        }

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<Response> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                organization: true,
                roles: {
                    organization: true,
                    permissions: {
                        organization: true,
                    },
                },
            },
        });

        if (!user) return {
            success: false,
            data: null,
            expired: false,
            message: "User not found.",
            statusCode: 404
        }

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

}
