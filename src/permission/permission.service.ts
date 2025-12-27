import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UpdatePermissionDTO } from './dtos/update-permission.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.find({ relations: ['role'] });
    }

    async findOne(id: string): Promise<Permission | null> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['role'] });
        if (!perm) return null;
        return perm;
    }

    async findByRoleId(id: string): Promise<string[] | null> {
        const perm = await this.permissionRepository.find({ where: { role: { id: id } }, relations: ['role']});
    
        if(!perm) return null;

        return perm.map((permission) => {
            return permission.name
        });
    }

    async update(id: string, dto: UpdatePermissionDTO): Promise<Permission | null> {
        const perm = await this.findOne(id);

        if(!perm) return null

        if (dto.name) perm.name = dto.name;
        return this.permissionRepository.save(perm);
    }

    async delete(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }
}
