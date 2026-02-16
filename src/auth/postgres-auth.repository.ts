import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { Refresh_token } from '../user/entities/refresh_token.entity';
import { IAuthRepository } from './auth.repository.interface';

@Injectable()
export class PostgresAuthRepository implements IAuthRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Refresh_token)
        private readonly refreshRepo: Repository<Refresh_token>,
    ) { }

    findUserByEmail(email: string) {
        return this.userRepo.findOne({ where: { email }, relations: ['organization'] });
    }

    findUserById(id: string) {
        return this.userRepo.findOne({ where: { id }, relations: ['organization'] });
    }

    async createUser(data: any) {
        const entity = this.userRepo.create(data);
        return this.userRepo.save(entity);
    }

    async saveRefreshToken(userId: string, token: string) {
        const entity = this.refreshRepo.create({
            user: { id: userId },
            refresh_token: token,
        });
        await this.refreshRepo.save(entity);
    }

    findRefreshToken(token: string) {
        return this.refreshRepo.findOne({
            where: { refresh_token: token },
        });
    }

    async updateRefreshToken(id: string, newToken: string) {
        const res = await this.refreshRepo.update(id, {
            refresh_token: newToken,
        });
        return !!res.affected;
    }

    async deleteRefreshToken(userId: string, token: string) {
        const res = await this.refreshRepo.delete({
            user: { id: userId },
            refresh_token: token,
        });
        return !!res.affected;
    }
}
