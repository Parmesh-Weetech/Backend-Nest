import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UpdatePermissionDTO } from './dtos/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.find({ relations: ['role'] });
    }

    async findOne(id: string): Promise<Permission> {
        const perm = await this.permissionRepository.findOne({ where: { id }, relations: ['role'] });
        if (!perm) throw new NotFoundException('Permission not found');
        return perm;
    }

    async update(id: string, dto: UpdatePermissionDTO): Promise<Permission> {
        const perm = await this.findOne(id);
        if (dto.name) perm.name = dto.name;
        return this.permissionRepository.save(perm);
    }

    async delete(id: string): Promise<void> {
        await this.permissionRepository.delete(id);
    }
}
