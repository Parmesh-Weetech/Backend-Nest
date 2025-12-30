import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) { }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({ where: { id } });
        
        if (!role) return null
        
        return role;
    }

    async create(dto: CreateRoleDTO): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ where: { key: dto.key } });

        if (existingRole) throw new ConflictException("Role Already Exists!");

        const role = await this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description
        });

        return await this.roleRepository.save(role);
    }

    async update(dto: UpdateRoleDTO): Promise<Role | null> {
        const role = await this.findOne(dto.id);

        if (!role) return null

        if (dto.key) role.key = dto.key;
        if(dto.label) role.label = dto.label;
        if(dto.description) role.description = dto.description;

        return this.roleRepository.save(role);
    }

    async delete(id: string): Promise<void> {
        await this.roleRepository.softDelete(id);
    }

    async findRoleByKey(key: string): Promise<Role | null> {
        const role = await this.roleRepository.findOne({ where: { key: key } });

        if (!role) return null;

        return role;
    }
}
