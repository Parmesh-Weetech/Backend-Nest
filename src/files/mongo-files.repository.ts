import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IFilesRepository } from './files.repository.interface';

@Injectable()
export class MongoFilesRepository implements IFilesRepository {
    constructor(
        @InjectModel('File')
        private readonly model: Model<any>,
    ) { }

    async create(data: any) {
        const file = new this.model({
            ...data,
            userId: data.userId ?? data.user?.id ?? null,
        });
        return file.save();
    }

    async findById(id: string) {
        return this.model.findById(id).lean().exec();
    }

    async findByIdWithUser(id: string) {
        return this.model.findById(id).lean().exec();
    }

    async findByUser(userId: string) {
        return this.model.find({
            userId,
            status: { $nin: ['ORPHAN', 'PENDING'] },
        }).lean().exec();
    }

    async update(id: string, data: any) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    }

    async delete(id: string) {
        const res = await this.model.deleteOne({ _id: id });
        return res.deletedCount === 1;
    }
}
