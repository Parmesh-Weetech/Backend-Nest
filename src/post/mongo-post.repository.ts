import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPostRepository } from './post.repository.interface';

@Injectable()
export class MongoPostRepository implements IPostRepository {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<any>,
    ) { }

    private toPlain(document: any) {
        if (!document) return null;

        const raw = typeof document.toObject === 'function'
            ? document.toObject()
            : document;

        const id = raw?._id?.toString?.() ?? String(raw._id ?? raw.id);
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id,
        };
    }

    async create(data: any) {
        const document = new this.postModel(data);
        const saved = await document.save();
        return this.toPlain(saved);
    }

    async findAll(userId: string) {
        const documents = await this.postModel.find({ userId }).lean().exec();
        return documents.map((document: any) => this.toPlain(document));
    }

    async findOne(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.postModel.findById(id).lean().exec();
        return this.toPlain(document);
    }

    async update(id: string, data: any) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.postModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
        return this.toPlain(document);
    }

    async remove(id: string) {
        const result = await this.postModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
