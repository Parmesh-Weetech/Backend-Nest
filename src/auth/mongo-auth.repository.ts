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

    private toPlain(document: any) {
        if (!document) return null;

        const raw = typeof document.toObject === 'function'
            ? document.toObject()
            : document;

        const id = raw?._id?.toString?.() ?? String(raw.id ?? raw._id);
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id,
        };
    }

    async findUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email }).lean().exec();
        return this.toPlain(user);
    }

    async findUserById(id: string) {
        const user = await this.userModel.findOne(this.byIdFilter(id)).lean().exec();
        return this.toPlain(user);
    }

    async createUser(data: any) {

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

        const user = new this.userModel({
            ...data,
            organization: organizationId,
            roles: roleIds,
            password: data.password,
        });
        const saved = await user.save();
        return this.toPlain(saved);
    }

    async saveRefreshToken(userId: string, token: string) {
        const refreshToken = new this.refreshModel({
            userId,
            refresh_token: token,
        });
        await refreshToken.save();
    }

    async findRefreshToken(token: string) {
        const refresh = await this.refreshModel.findOne({ refresh_token: token }).lean().exec();
        return this.toPlain(refresh);
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
