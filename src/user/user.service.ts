import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto.js';
import { updateUserDTO } from './dtos/update-user.dto.js';
import { RoleService } from '../role/role.service.js';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService
    ) { }

    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['role'] });

        if (!users) throw new NotFoundException("Users not found.");

        return users;
    }

    async findOne(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });

        if (!user) return null

        return user;
    }

    async create(createUserDTO: CreateUserDTO, user: User): Promise<User> {
        const role = await this.roleService.findOne(createUserDTO.roleId);

        if (!role) throw new NotFoundException("Role not found.");

        const newUser = await this.userRepository.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            role: role
        });

        return await this.userRepository.save(newUser);
    }

    async update(updateUserDTO: updateUserDTO): Promise<User | null> {
        const user = await this.findOne(updateUserDTO.id);
        if (!user) return null;

        const role = await this.roleService.findOne(updateUserDTO.roleId);
        if (!role) throw new NotFoundException("Role not found.");

        if (user.name) user.name = updateUserDTO.name;
        if (user.email) user.email = updateUserDTO.email;
        if (user.password) user.password = updateUserDTO.password;

        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<string | null> {
        const user = await this.findOne(id);

        if (!user) return null;

        const deleteAction = await this.userRepository.softDelete(user.id);

        if (!deleteAction) throw new InternalServerErrorException("Internal Server Error");

        return "User Deleted Successfully."
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email: email }, relations: ['role'] });

        if (!user) return null;

        return user;
    }

}
