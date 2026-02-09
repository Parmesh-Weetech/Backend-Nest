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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
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

    async findAllCachedUser(user: User): Promise<APIResponse> {
        const usersKey = this.usersKey(user.id);
        let cachedUsers = await this.cacheService.get<User[]>(usersKey);

        if (!cachedUsers) {
            const users = await this.userRepository.find({ where: { id: Not(user.id) }, relations: ['roles'] });

            if (!users || users.length === 0) throw new NotFoundException('Users not found.');

            cachedUsers = users;

            await this.cacheService.set(usersKey, users, 600);
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

    async findAllUser(currentUser: User): Promise<APIResponse> {
        const users = await this.userRepository.find({ where: { id: Not(currentUser.id) }, relations: ['roles'] });

        if (!users || users.length === 0) throw new NotFoundException('Users not found.');

        return {
            success: true,
            data: users,
            expired: false,
            message: 'Users fetched successfully.',
            statusCode: 200,
        };
    }

    async findOne(id: string): Promise<APIResponse> {
        const cacheKey = this.userKey(id);
        let cachedUser = await this.cacheService.get(cacheKey);

        if (!cachedUser) {
            const fetchedUser = await this.userRepository.findOne({ where: { id: id }, relations: {
                organization: true,
                roles: {
                    organization: true,
                    permissions: {
                        organization: true,
                    },
                },
            } });

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

        const newUser = await this.userRepository.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            roles: requiredRoles,
            organization: organization.data
        });

        const savedUser = await this.userRepository.save(newUser);
        if (!savedUser) throw new InternalServerErrorException('User could not be created.');

        return {
            success: true,
            data: savedUser,
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
            if (!organization) throw new NotFoundException('Organization not found.');

            user.data.organization = organization.data;
        }

        const savedUser = await this.userRepository.save(user.data);
        if (!savedUser) throw new InternalServerErrorException('User could not be updated.');

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

        const affectedRows = await this.userRepository.softDelete(id);

        if ((affectedRows.affected === null || affectedRows.affected === undefined) && affectedRows.affected === 0) throw new InternalServerErrorException('User could not be deleted.');

        return {
            success: true,
            data: affectedRows,
            expired: false,
            message: "User deleted successfully.",
            statusCode: 200
        }
    }

    async findOneByEmail(email: string): Promise<APIResponse> {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['roles'] });
        if (!user) throw new NotFoundException('User not found.');

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
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
