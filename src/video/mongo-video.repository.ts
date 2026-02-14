import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IVideoRepository } from './video.interface.repository';
import { VideoDocument } from './schemas/video.schema';

@Injectable()
export class MongoVideoRepository implements IVideoRepository {
    constructor(
        @InjectModel(VideoDocument.name)
        private readonly model: Model<VideoDocument>,
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

        const normalizedId = raw?.id ?? raw?._id?.toString?.();
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id: String(normalizedId),
        };
    }

    async create(data: any): Promise<any> {
        return new this.model({
            ...data,
            userId: data.userId ?? data.user?.id ?? null,
        });
    }

    async save(video: any): Promise<any> {
        const saved = await video.save();
        return this.toPlain(saved);
    }

    async findById(id: string): Promise<any> {
        const video = await this.model.findOne(this.byIdFilter(id)).lean().exec();
        return this.toPlain(video);
    }

    async update(id: string, data: any): Promise<void> {
        await this.model.findOneAndUpdate(this.byIdFilter(id), data).exec();
    }

    async delete(id: string): Promise<void> {
        await this.model.findOneAndDelete(this.byIdFilter(id)).exec();
    }
}
