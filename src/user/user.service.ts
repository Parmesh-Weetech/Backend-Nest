import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { Response } from '../common/response/response.dto.js';
import { CacheService } from '../cache/cache.service.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService,
        private readonly cacheService: CacheService
    ) { }

    private userKey(id: string) {
        return `user:${id}`;
    }

    async findAll(currentUser: User): Promise<Response> {
        const users = await this.userRepository.find({ where: { id: Not(currentUser.id) }, relations: ['roles'] });

        if (!users || users.length === 0) {
            return {
                success: false,
                data: null,
                expired: false,
                message: 'Users not found.',
                statusCode: 404,
            };
        }

        const user = users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

        return {
            success: true,
            data: user,
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findAllUser(currentUser: User): Promise<Response> {
        const users = await this.userRepository.find({ where: { id: Not(currentUser.id) }, relations: ['roles'] });

        if (!users || users.length === 0) {
            return {
                success: false,
                data: null,
                expired: false,
                message: 'Users not found.',
                statusCode: 404,
            };
        }

        return {
            success: true,
            data: users,
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findOne(id: string): Promise<Response> {
        const cacheKey = this.userKey(id);
        let cachedUser = await this.cacheService.get(cacheKey);

        if (!cachedUser) {
            const fetchedUser = await this.userRepository.findOne({ where: { id: id }, relations: ['roles', 'organization'] });

            if (!fetchedUser) return {
                success: false,
                data: null,
                expired: false,
                message: "User not found.",
                statusCode: 404
            }

            cachedUser = fetchedUser;
            // TTL in seconds (600 = 10 minutes)
            await this.cacheService.set(cacheKey, fetchedUser, 600);
        }

        if (!cachedUser) return {
            success: false,
            data: null,
            expired: false,
            message: "User not found.",
            statusCode: 404
        }

        return {
            success: true,
            data: cachedUser,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async create(createUserDTO: CreateUserDTO, orgId: string): Promise<Response> {
        const roles = await Promise.all(
            createUserDTO.roleIds.map(roleId =>
                this.roleService.findOne(roleId),
            ),
        );

        const requiredRoles = roles.map(role => role.data)

        const organization = await this.organizationService.findOne(orgId);

        if (!organization) return {
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

    async update(updateUserDTO: updateUserDTO): Promise<Response> {
        const user = await this.findOne(updateUserDTO.id);

        if (updateUserDTO.roleIds) {
            const roles = await Promise.all(
                updateUserDTO.roleIds.map(roleId =>
                    this.roleService.findOne(roleId),
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

    async remove(id: string): Promise<Response> {
        const user = await this.findOne(id);

        try {
            const affectedRows = await this.userRepository.softDelete(user.data.id);

            if ((affectedRows.affected === null || affectedRows.affected === undefined) && affectedRows.affected === 0) return {
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
