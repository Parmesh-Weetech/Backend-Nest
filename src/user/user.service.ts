import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';
import { RoleService } from '../role/role.service';
import { OrganizationService } from '../organization/organization.service';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService,

        @Inject(forwardRef(() => OrganizationService))
        private readonly organizationService: OrganizationService,

        private readonly cacheService: CacheService
    ) { }

    private userKey(id: string) {
        return `user:${id}`;
    }

    private usersKey(userId: string) {
        return `users:${userId}`
    }

    async findAllCachedUser(userId: string): Promise<APIResponse> {
        const usersKey = this.usersKey(userId);
        let cachedUsers = await this.cacheService.get<User[]>(usersKey);

        if (!cachedUsers) {
            const users = await this.userRepository.findAll(userId);
            if (!users || users === null || users === undefined) throw new NotFoundException('Users not found.');

            cachedUsers = users;

            if (users.length !== 0) await this.cacheService.set(usersKey, users, 600);
        }

        const response = cachedUsers.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

        return {
            success: true,
            data: response,
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findAllUser(userId: string): Promise<APIResponse> {
        const users = await this.userRepository.findAll(userId);
        if (!users || users === null || users === undefined) throw new NotFoundException('Users not found.');

        return {
            success: true,
            data: users.length > 0 ? users : [],
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const cacheKey = this.userKey(id);
        let cachedUser = await this.cacheService.get(cacheKey);

        if (!cachedUser) {
            const fetchedUser = await this.userRepository.findById(id);
            if (!fetchedUser) throw new NotFoundException('User not found.');

            cachedUser = fetchedUser;

            await this.cacheService.set(cacheKey, fetchedUser, 600);
        }

        return {
            success: true,
            data: cachedUser,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async create(createUserDTO: CreateUserDTO, orgId: string): Promise<APIResponse> {
        const roles = await Promise.all(
            createUserDTO.roleIds.map(roleId =>
                this.roleService.findOne(roleId),
            ),
        );

        const requiredRoles = roles.map(role => role.data)

        const organization = await this.organizationService.findOne(orgId);
        if (!organization) throw new NotFoundException('Organization not found.');

        const user = await this.userRepository.createUser(createUserDTO, requiredRoles, organization.data);
        if (!user) throw new InternalServerErrorException('Something went wrong while creating user.');

        return {
            success: true,
            data: user,
            expired: false,
            message: "User created successfully.",
            statusCode: 201
        }
    }

    async update(updateUserDTO: updateUserDTO): Promise<APIResponse> {
        const user = await this.findOne(updateUserDTO.id);

        if (updateUserDTO.roleIds) {
            const roles = await Promise.all(
                updateUserDTO.roleIds.map(roleId =>
                    this.roleService.findOne(roleId),
                ),
            );

            user.data.roles = roles;
        }

        if (updateUserDTO.name) user.data.name = updateUserDTO.name;
        if (updateUserDTO.email) user.data.email = updateUserDTO.email;
        if (updateUserDTO.password) user.data.password = updateUserDTO.password;
        if (updateUserDTO.organizationId) {
            const organization = await this.organizationService.findOne(updateUserDTO.organizationId);

            user.data.organization = organization.data;
        }

        const savedUser = await this.userRepository.updateUser(user.data);
        if (!savedUser) throw new InternalServerErrorException('Something went wrong while creating user.');

        return {
            success: true,
            data: savedUser,
            expired: false,
            message: "User updated successfully.",
            statusCode: 200
        }
    }

    async remove(id: string): Promise<APIResponse> {
        await this.findOne(id);

        const affectedRows = await this.userRepository.softDeleteUser(id);

        if (!affectedRows) throw new InternalServerErrorException('User could not be deleted.');

        return {
            success: true,
            data: affectedRows,
            expired: false,
            message: "User deleted successfully.",
            statusCode: 200
        }
    }
}
