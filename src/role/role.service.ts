import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDTO } from './dtos/create-role.dto.js';
import { UpdateRoleDTO } from './dtos/update-role.dto.js';
import { OrganizationService } from '../organization/organization.service.js';
import { User } from '../user/entities/user.entity.js';

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
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['organization', 'permissions'] });

        if (!role) throw new NotFoundException("Role not found.")

        return role;
    }

    async create(dto: CreateRoleDTO, orgId: string): Promise<Role> {
        if (!orgId) throw new NotFoundException("Organization not found.");
        const organization = await this.organizationService.findOne(orgId);

        const role = await this.roleRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            organization: organization,
        });

        if (!role) throw new InternalServerErrorException("Internal server error while creating roles");

        return role;
    }

    async update(dto: UpdateRoleDTO): Promise<Role> {
        const role = await this.findOne(dto.id);

        if (!role) throw new NotFoundException("Role not found")

        if (dto.key) role.key = dto.key;
        if (dto.label) role.label = dto.label;
        if (dto.description) role.description = dto.description;

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
