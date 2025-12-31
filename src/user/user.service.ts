import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { RoleService } from '../role/role.service.js';
import { Role } from '../role/entities/role.entity.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService
    ) { }

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['roles'] });

        if (!users) throw new NotFoundException("Users not found.");

        return users;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });

        if (!user) throw new NotFoundException("User not found.")

        return user;
    }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        const roles = await Promise.all(
            createUserDTO.roleIds.map(roleId =>
                this.roleService.findOne(roleId),
            ),
        );

        if (!roles || roles.length === 0) throw new NotFoundException("Role not found.");

        const newUser = await this.userRepository.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            roles: roles
        });

        return await this.userRepository.save(newUser);
    }

    async update(updateUserDTO: updateUserDTO): Promise<User> {
        const user = await this.findOne(updateUserDTO.id);

        if (!user) throw new NotFoundException("User not found");

        if (updateUserDTO.roleIds) {
            const roles = await Promise.all(
                updateUserDTO.roleIds.map(roleId =>
                    this.roleService.findOne(roleId),
                ),
            );

            if (!roles) throw new NotFoundException("Role not found.");

            user.roles = roles;
        }

        if (updateUserDTO.name) user.name = updateUserDTO.name;
        if (updateUserDTO.email) user.email = updateUserDTO.email;
        if (updateUserDTO.password) user.password = updateUserDTO.password;
        

        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<string> {
        const user = await this.findOne(id);

        if (!user) throw new NotFoundException("User not found");

        const deleteAction = await this.userRepository.softDelete(user.id);

        if (!deleteAction) throw new InternalServerErrorException("Internal Server Error");

        return "User Deleted Successfully."
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['roles'] });

        if (!user) throw new NotFoundException("User not found.");

        return user;
    }

}
