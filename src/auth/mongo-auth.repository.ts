import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

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

    private byIdFilter(id: string) {
        if (Types.ObjectId.isValid(id)) {
            return {
                $or: [
                    { _id: new Types.ObjectId(id) },
                    { id },
                ],
            };
        }

        return { id };
    }

    findUserByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    findUserById(id: string) {
        return this.userModel.findOne(this.byIdFilter(id));
    }

    async createUser(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const organizationId = typeof data.organization === 'object'
            ? data.organization?.id ?? data.organization?._id?.toString?.()
            : data.organization;

        const roleIds = Array.isArray(data.roles)
            ? data.roles
                .map((role: any) => (typeof role === 'object'
                    ? role?.id ?? role?._id?.toString?.()
                    : role))
                .filter(Boolean)
            : [];

        return this.userModel.create({
            ...data,
            organization: organizationId,
            roles: roleIds,
            password: hashedPassword,
        });
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
