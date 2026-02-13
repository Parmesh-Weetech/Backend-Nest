import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from './user.repository.interface';
import { User } from './entities/user.entity';

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
}
