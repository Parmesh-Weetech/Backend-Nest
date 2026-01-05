import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { UserCreationFailedError, UserDeletionFailedError } from './errors/errors.js';
import { UserUpdationFailedError } from './errors/errors.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['roles'] });

        if (!users) throw new NotFoundException("Users not found.");

        return users;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'organization'] });
        
        if (!user) throw new NotFoundException("User not found.")

        return user;
    }

    async create(createUserDTO: CreateUserDTO, orgId: string): Promise<User> {
        const roles = await Promise.all(
            createUserDTO.roleIds.map(roleId =>
                this.roleService.findOne(roleId),
            ),
        );

        const organization = await this.organizationService.findOne(orgId);
        
        try {
            const newUser = await this.userRepository.create({
                name: createUserDTO.name,
                email: createUserDTO.email,
                password: createUserDTO.password,
                roles: roles,
                organization: organization
            });

            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new UserCreationFailedError();
        }
    }

    async update(updateUserDTO: updateUserDTO): Promise<User> {
        const user = await this.findOne(updateUserDTO.id);

        if (updateUserDTO.roleIds) {
            const roles = await Promise.all(
                updateUserDTO.roleIds.map(roleId =>
                    this.roleService.findOne(roleId),
                ),
            );

            user.roles = roles;
        }

        try {
            if (updateUserDTO.name) user.name = updateUserDTO.name;
            if (updateUserDTO.email) user.email = updateUserDTO.email;
            if (updateUserDTO.password) user.password = updateUserDTO.password;


            return await this.userRepository.save(user);
        } catch (error) {
            throw new UserUpdationFailedError();
        }
    }

    async delete(id: string): Promise<string> {
        const user = await this.findOne(id);

        try {
            await this.userRepository.softDelete(user.id);

            return "User Deleted Successfully."
        } catch (error) {
            throw new UserDeletionFailedError();
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['roles'] });

        if (!user) throw new NotFoundException("User not found.");

        return user;
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<User> {
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

        if (!user) throw new NotFoundException("User not found.");

        return user;
    }

}
