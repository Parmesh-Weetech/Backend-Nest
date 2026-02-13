import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IAuthRepository } from './auth.repository.interface';
import { UserDocument } from '../user/schemas/user.schema';
import { RefreshTokenDocument } from '../user/schemas/refresh-token.schema';

@Injectable()
export class MongoAuthRepository implements IAuthRepository {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(RefreshTokenDocument.name)
        private readonly refreshModel: Model<RefreshTokenDocument>,
    ) { }

    findUserByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    findUserById(id: string) {
        return this.userModel.findById(id);
    }

    createUser(data: any) {
        return this.userModel.create(data);
    }

    async saveRefreshToken(userId: string, token: string) {
        await this.refreshModel.create({
            userId,
            refresh_token: token,
        });
    }

    findRefreshToken(token: string) {
        return this.refreshModel.findOne({ refresh_token: token });
    }

    async updateRefreshToken(id: string, newToken: string) {
        const res = await this.refreshModel.findByIdAndUpdate(id, {
            refresh_token: newToken,
        });
        return !!res;
    }

    async deleteRefreshToken(userId: string, token: string) {
        const res = await this.refreshModel.deleteOne({
            userId,
            refresh_token: token,
        });
        return res.deletedCount > 0;
    }
}
