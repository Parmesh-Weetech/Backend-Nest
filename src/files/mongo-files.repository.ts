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
        return this.model.create({
            ...data,
            userId: data.user?.id ?? null,
        });
    }

    async findById(id: string) {
        return this.model.findById(id);
    }

    async findByIdWithUser(id: string) {
        return this.model.findById(id);
    }

    async findByUser(userId: string) {
        return this.model.find({
            userId,
            status: { $nin: ['ORPHAN', 'PENDING'] },
        });
    }

    async update(id: string, data: any) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        const res = await this.model.deleteOne({ _id: id });
        return res.deletedCount === 1;
    }
}
