import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
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

    private normalizeId(value: any): string | null {
        if (!value) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            if (value.id) return String(value.id);
            if (value._id?.toString) return value._id.toString();
        }
        return null;
    }

    private mapRolesForPersistence(roles: any[]): any[] {
        if (!this.isMongoProvider) return roles;
        return (Array.isArray(roles) ? roles : [])
            .map((role: any) => this.normalizeId(role))
            .filter((roleId: string | null): roleId is string => !!roleId);
    }

    private mapOrganizationForPersistence(organization: any): any {
        if (!this.isMongoProvider) return organization;
        return this.normalizeId(organization);
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
        const uniqueRoleIds = [...new Set(createUserDTO.roleIds)];
        if (uniqueRoleIds.length !== createUserDTO.roleIds.length) {
            throw new ConflictException('Duplicate roles are not allowed for the same user in an organization.');
        }

        const roles = await Promise.all(
            uniqueRoleIds.map((roleId) => this.roleService.findOne(roleId))
        );

        const organization = await this.organizationService.findOne(orgId);
        if (!organization) throw new NotFoundException('Organization not found.');
        const organizationId = this.normalizeId(organization.data);

        for (const roleResponse of roles) {
            const roleOrgId = this.normalizeId(roleResponse.data?.organization);
            if (roleOrgId && organizationId && roleOrgId !== organizationId) {
                throw new ConflictException('Role belongs to a different organization.');
            }
        }

        const newUser = {
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: await bcrypt.hash(createUserDTO.password, 10),
            roles: this.mapRolesForPersistence(roles.map((role) => role.data)),
            organization: this.mapOrganizationForPersistence(organization.data),
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
        const userRecord = await this.userRepository.findOne(updateUserDTO.id);
        if (!userRecord) throw new NotFoundException('User not found.');

        const userData = (userRecord as any).data ?? userRecord;

        const organization = updateUserDTO.organizationId
            ? await this.organizationService.findOne(updateUserDTO.organizationId)
            : null;

        const targetOrganization = organization?.data ?? userData.organization;
        const targetOrganizationId = this.normalizeId(targetOrganization);

        let rolesData = userData.roles;

        if (updateUserDTO.roleIds) {
            const uniqueRoleIds = [...new Set(updateUserDTO.roleIds)];
            if (uniqueRoleIds.length !== updateUserDTO.roleIds.length) {
                throw new ConflictException('Duplicate roles are not allowed for the same user in an organization.');
            }

            const existingRoleIds = new Set(
                (Array.isArray(userData.roles) ? userData.roles : [])
                    .map((role: any) => this.normalizeId(role))
                    .filter(Boolean),
            );

            const alreadyAssignedRoleIds = uniqueRoleIds.filter((roleId) => existingRoleIds.has(roleId));
            if (alreadyAssignedRoleIds.length > 0) {
                throw new ConflictException('One or more roles are already assigned to this user in the organization.');
            }

            const roles = await Promise.all(
                uniqueRoleIds.map((roleId) => this.roleService.findOne(roleId)),
            );

            for (const roleResponse of roles) {
                const roleOrgId = this.normalizeId(roleResponse.data?.organization);
                if (roleOrgId && targetOrganizationId && roleOrgId !== targetOrganizationId) {
                    throw new ConflictException('Role belongs to a different organization.');
                }
            }

            rolesData = roles.map((role) => role.data);
        }

        const updatedUserData = {
            ...userData,
            name: updateUserDTO.name || userData.name,
            email: updateUserDTO.email || userData.email,
            password: updateUserDTO.password
                ? await bcrypt.hash(updateUserDTO.password, 10)
                : userData.password,
            roles: this.mapRolesForPersistence(rolesData),
            organization: this.mapOrganizationForPersistence(targetOrganization),
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

        const userData = (user as any)?.data ?? user;

        if (!userData) throw new NotFoundException('User not found.');

        return {
            success: true,
            data: userData,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }
}
