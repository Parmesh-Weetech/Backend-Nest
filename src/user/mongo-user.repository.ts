import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserRepository } from './user.repository.interface';
import { User } from './entities/user.entity';
import { APIResponse } from 'src/common/response/response.dto';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserDocument.name) private readonly userModel: Model<any>,
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

    async create(data: any) {
        return this.userModel.create(data);
    }

    async findAll(userId: string) {
        if (Types.ObjectId.isValid(userId)) {
            return this.userModel.find({ _id: { $ne: new Types.ObjectId(userId) } });
        }

        return this.userModel.find({ id: { $ne: userId } });
    }

    async findOne(id: string) {
        return this.userModel.findOne(this.byIdFilter(id)).populate('roles organization');
    }

    async update(id: string, data: any) {
        return this.userModel.findOneAndUpdate(this.byIdFilter(id), data, { new: true });
    }

    async remove(id: string) {
        const result = await this.userModel.deleteOne(this.byIdFilter(id));
        return result.deletedCount > 0;
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
        const user = await this.userModel
            .findOne(this.byIdFilter(userId))
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions',
                    model: 'Permission'
                }
            })
            .populate('organization');

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched with roles and permissions successfully.",
            statusCode: 200
        };
    }
}
