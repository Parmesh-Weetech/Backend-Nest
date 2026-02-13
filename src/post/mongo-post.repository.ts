import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPostRepository } from './post.repository.interface';

@Injectable()
export class MongoPostRepository implements IPostRepository {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<any>,
    ) { }

    async create(data: any) {
        return this.postModel.create(data);
    }

    async findAll(userId: string) {
        return this.postModel.find({ userId });
    }

    async findOne(id: string) {
        return this.postModel.findById(id);
    }

    async update(id: string, data: any) {
        return this.postModel.findByIdAndUpdate(id, data, { new: true });
    }

    async remove(id: string) {
        const result = await this.postModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}