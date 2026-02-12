import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demo } from './schemas/demo.schema';
import { ResponseUserDTO } from './dtos/user.dto';

@Injectable()
export class MongodbService {
    constructor(@InjectModel(Demo.name) private userModel: Model<Demo>) { }

    async create(name: string, email: string) {
        const user = await this.userModel.create({ name, email });
        const createdUser = user.toObject();

        return {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email
        }
    }

    async findAll() {
        return this.userModel.find().exec();
    }

    async findOne(id: string) {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, data: any) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async remove(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
