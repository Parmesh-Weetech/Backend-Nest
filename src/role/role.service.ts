import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { OrganizationService } from '../organization/organization.service.js';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private readonly organizationService: OrganizationService
    ) { }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['users'] });
        
        if (!role) throw new NotFoundException("Role not found.")
        
        return role;
    }

    async create(dto: CreateRoleDTO): Promise<Role> {
        const organization = await this.organizationService.findOne(dto.organizationId);

        if(!organization) throw new NotFoundException("Organization not found.");

        const existingRole = await this.roleRepository.findOne({ where: { key: dto.key, organization: { id: dto.organizationId } } });

        if (existingRole) throw new ConflictException("Role Already Exists!");

        const role = await this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            organization: organization
        });

        return await this.roleRepository.save(role);
    }

    async update(dto: UpdateRoleDTO): Promise<Role> {
        const role = await this.findOne(dto.id);

        if (!role) throw new NotFoundException("Role not found")

        if (dto.key) role.key = dto.key;
        if(dto.label) role.label = dto.label;
        if(dto.description) role.description = dto.description;

        return this.roleRepository.save(role);
    }

    async delete(id: string): Promise<void> {
        await this.roleRepository.softDelete(id);
    }

    async findRoleByKey(key: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { key: key } });

        if (!role) throw new NotFoundException("Role not found.");

        return role;
    }

    async findRoleByOrganization(key: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { key: key, organization: IsNull() }, relations: ['permissions'] });

        if (!role) throw new NotFoundException("Role not found.");

        return role;
    }
}
