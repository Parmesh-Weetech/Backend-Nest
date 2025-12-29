import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { PermissionService } from 'src/permission/permission.service.js';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) { }

    async createRole(dto: CreateRoleDTO): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ where: { key: dto.key }});

        if(existingRole) {
            throw new ConflictException("Role Already Exists!");
        }

        const role = await this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description
        });

        return await this.roleRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) return null
        return role;
    }

    async findRoleByKey(key: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({ where: { key: key }});

        if(!role) return null;

        return role;
    }

    async updateRole(dto: UpdateRoleDTO): Promise<Role | null> {
        const role = await this.findOne(dto.id);

        if (!role) return null

        if (dto.key) role.key = dto.key;
        if(dto.label) role.label = dto.label;
        if(dto.description) role.description = dto.description;

        return this.roleRepository.save(role);
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepository.delete(id);
    }
}
