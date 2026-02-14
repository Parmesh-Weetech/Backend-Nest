import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';
import { RoleService } from '../role/role.service';
import { OrganizationService } from '../organization/organization.service';
import { APIResponse } from '../common/response/response.dto';
import { CacheService } from '../cache/cache.service';
import { type IUserRepository } from './user.repository.interface';

@Injectable()
export class UserService {
    constructor(
        @Inject('USERS_REPOSITORY') private readonly userRepository: IUserRepository,
        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService,

        @Inject(forwardRef(() => OrganizationService))
        private readonly organizationService: OrganizationService,
        private readonly cacheService: CacheService
    ) { }

    private readonly isMongoProvider =
        ['mongo', 'mongodb'].includes((process.env.DATABASE_PROVIDER ?? '').toLowerCase());

    private userKey(id: string) {
        return `user:${id}`;
    }

    private usersKey(userId: string) {
        return `users:${userId}`
    }

    async findAllCachedUser(user: User): Promise<APIResponse> {
        const usersKey = this.usersKey(user.id);
        let cachedUsers: User[] | null = null;

        if (this.isMongoProvider) {
            const users = await this.userRepository.findAll(user.id);

            if (!users || users.length === 0) throw new NotFoundException('Users not found.');

            return {
                success: true,
                data: users.map((u) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                })),
                expired: false,
                message: 'Users fetched successfully.',
                statusCode: 200,
            };
        }

        try {
            cachedUsers = await this.cacheService.get<User[]>(usersKey);
        } catch {
            cachedUsers = null;
        }

        if (!cachedUsers) {
            const users = await this.userRepository.findAll(user.id);

            if (!users || users.length === 0) throw new NotFoundException('Users not found.');

            cachedUsers = users;

            try {
                await this.cacheService.set(usersKey, users, 600);
            } catch {
                // Fallback to DB-only flow when cache backend is unavailable.
            }
        }

        return {
            success: true,
            data: cachedUsers.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
            })),
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const cacheKey = this.userKey(id);
        let cachedUser: any = null;

        if (this.isMongoProvider) {
            const fetchedUser = await this.userRepository.findOne(id);
            if (!fetchedUser) throw new NotFoundException('User not found.');

            return {
                success: true,
                data: fetchedUser,
                expired: false,
                message: 'User fetched successfully.',
                statusCode: 200,
            };
        }

        try {
            cachedUser = await this.cacheService.get(cacheKey);
        } catch {
            cachedUser = null;
        }

        if (!cachedUser) {
            const fetchedUser = await this.userRepository.findOne(id);

            if (!fetchedUser) throw new NotFoundException('User not found.');

            cachedUser = fetchedUser;

            try {
                await this.cacheService.set(cacheKey, fetchedUser, 600); // Cache user for 10 minutes
            } catch {
                // Fallback to DB-only flow when cache backend is unavailable.
            }
        }

        return {
            success: true,
            data: cachedUser,
            expired: false,
            message: 'User fetched successfully.',
            statusCode: 200,
        };
    }

    async create(createUserDTO: CreateUserDTO, orgId: string): Promise<APIResponse> {
        const roles = await Promise.all(
            createUserDTO.roleIds.map((roleId) => this.roleService.findOne(roleId))
        );

        const organization = await this.organizationService.findOne(orgId);
        if (!organization) throw new NotFoundException('Organization not found.');

        const newUser = {
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            roles: roles.map((role) => role.data),
            organization: organization.data,
        };

        const savedUser = await this.userRepository.create(newUser);
        if (!savedUser) throw new InternalServerErrorException('User could not be created.');

        return {
            success: true,
            data: savedUser,
            expired: false,
            message: 'User created successfully.',
            statusCode: 201,
        };
    }

    async update(updateUserDTO: updateUserDTO): Promise<APIResponse> {
        const user = await this.userRepository.findOne(updateUserDTO.id);
        if (!user) throw new NotFoundException('User not found.');

        const roles = updateUserDTO.roleIds
            ? await Promise.all(
                updateUserDTO.roleIds.map((roleId) => this.roleService.findOne(roleId))
            )
            : user.data.roles;

        const organization =
            updateUserDTO.organizationId &&
            (await this.organizationService.findOne(updateUserDTO.organizationId));

        if (!organization || organization.data === "") throw new NotFoundException({ message: "Organization not found while updating user " });

        const updatedUserData = {
            ...user.data,
            name: updateUserDTO.name || user.data.name,
            email: updateUserDTO.email || user.data.email,
            password: updateUserDTO.password || user.data.password,
            roles: roles || user.data.roles,
            organization: organization.data || user.data.organization,
        };

        const savedUser = await this.userRepository.update(updateUserDTO.id, updatedUserData);
        if (!savedUser) throw new InternalServerErrorException('User could not be updated.');

        return {
            success: true,
            data: savedUser,
            expired: false,
            message: 'User updated successfully.',
            statusCode: 200,
        };
    }

    async remove(id: string): Promise<APIResponse> {
        const user = await this.userRepository.findOne(id);
        if (!user) throw new NotFoundException('User not found.');

        const result = await this.userRepository.remove(id);
        if (!result) throw new InternalServerErrorException('User could not be deleted.');

        return {
            success: true,
            data: result,
            expired: false,
            message: 'User deleted successfully.',
            statusCode: 200,
        };
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
        const user = await this.userRepository.findOneWithRolesAndPermissions(userId)

        if (!user) throw new NotFoundException('User not found.');

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }
}
