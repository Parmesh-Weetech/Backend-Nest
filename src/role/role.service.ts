import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async createRole(dto: CreateRoleDTO): Promise<Role> {
        const role = this.roleRepository.create({
            name: dto.name,
            permissions: dto.permissions.map(p => this.permissionRepository.create(p)),
        });
        return this.roleRepository.save(role);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
        if (!role) throw new NotFoundException('Role not found');
        return role;
    }

    async updateRole(id: string, dto: UpdateRoleDTO): Promise<Role> {
        const role = await this.findOne(id);

        if (dto.name) role.name = dto.name;
        if (dto.permissions) {
            // replace permissions
            role.permissions = dto.permissions.map(p => this.permissionRepository.create(p));
        }

        return this.roleRepository.save(role);
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleRepository.delete(id);
    }
}
