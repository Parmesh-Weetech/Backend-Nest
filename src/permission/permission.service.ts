import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity.js';
import { UpdatePermissionDTO } from './dtos/update-permission.dto.js';
import { CreatePermissionDTO } from './dtos/create-permission.dto.js';
import { RoleService } from '../role/role.service.js';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly roleService: RoleService
    ) { }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.find({ relations: ['role'] });
    }

    async findOne(id: string): Promise<Permission | null> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['role'] });
        if (!perm) return null;
        return perm;
    }

    async findByRoleId(id: string): Promise<Permission[] | null> {
        const perm = await this.permissionRepository.find({ where: { role: { id: id } }, relations: ['role'] });

        if (!perm) return null;

        return perm;
    }

    async create(dto: CreatePermissionDTO): Promise<Permission> {
        const perm = await this.permissionRepository.findOne({ where: { key: dto.key }});

        if(perm) throw new ConflictException("Permission Already Exists");

        const existingRole = await this.roleService.findOne(dto.roleId);

        if(!existingRole || existingRole === null) {
            throw new NotFoundException("Role not exists!");
        }

        const permission = await this.permissionRepository.create({
            key: dto.key,
            label: dto.label,
            description: dto.description,
            entity: dto.entity,
            action: dto.action,
            role: existingRole
        });

        return await this.permissionRepository.save(permission);
    }

    async update(dto: UpdatePermissionDTO): Promise<Permission | null> {
        const perm = await this.findOne(dto.id);

        if (!perm) return null

        if (dto.key) perm.key = dto.key;
        if(dto.label) perm.label = dto.label;
        if(dto.description) perm.description = dto.description;
        if(dto.entity) perm.entity = dto.entity;
        if(dto.action) perm.action = dto.action;
        if(dto.roleId) {
            const existingRole = await this.roleService.findOne(dto.roleId);

            if(!existingRole) {
                throw new NotFoundException("Role not exists!");
            }

            perm.role = existingRole;
        }

        return this.permissionRepository.save(perm);
    }

    async delete(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }
}
