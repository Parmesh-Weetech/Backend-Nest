import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { APIResponse } from 'src/common/response/response.dto';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(data: any) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async findAll(userId: string) {
        return this.userRepository.find({ where: { id: Not(userId) }, relations: ['roles'] });
    }

    async findOne(id: string) {
        return this.userRepository.findOne({ where: { id }, relations: ['roles', 'organization'] });
    }

    async update(id: string, data: any) {
        await this.userRepository.update({ id }, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        const result = await this.userRepository.softDelete(id);

        if (result.affected === undefined || result.affected === null || result.affected === 0) return false;

        return result.affected > 0;
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                organization: true,
                roles: {
                    organization: true,
                    permissions: {
                        organization: true,
                    },
                },
            },
        });

        if (!user) throw new NotFoundException('User not found.');

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched successfully.",
            statusCode: 200
        };
    }

    async findByOrgAndEmail(orgId: string, email: string): Promise<APIResponse> {
        const user = await this.userRepository.findOne({ where: { organization: { id: orgId }, email: email }});

        if(user) return {
            success: false,
            data: null,
            expired: false,
            message: "User already exists with this email in this organization!",
            statusCode: 409
        }

        return {
            success: true,
            data: null,
            expired: false,
            message: "No user found with this email in this organization.",
            statusCode: 200
        }
    }
}
