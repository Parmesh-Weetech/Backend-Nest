import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from './user.repository.interface';
import { User } from './entities/user.entity';
import { APIResponse } from 'src/common/response/response.dto';

@Injectable()
export class MongoUserRepository implements IUserRepository {
    constructor(
        @InjectModel('User') private readonly userModel: Model<any>,
    ) { }

    async create(data: any) {
        return this.userModel.create(data);
    }

    async findAll(userId: string) {
        return this.userModel.find({ _id: { $ne: userId } });
    }

    async findOne(id: string) {
        return this.userModel.findById(id).populate('roles organization');
    }

    async update(id: string, data: any) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async remove(id: string) {
        const result = await this.userModel.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
        const user = await this.userModel
            .findById(userId)
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
