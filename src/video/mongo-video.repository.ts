import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IVideoRepository } from './video.interface.repository';
import { VideoDocument } from './schemas/video.schema';

@Injectable()
export class MongoVideoRepository implements IVideoRepository {
    constructor(
        @InjectModel(VideoDocument.name)
        private readonly model: Model<VideoDocument>,
    ) { }

    async create(data: any): Promise<any> {
        return new this.model(data);
    }

    async save(video: any): Promise<any> {
        return video.save();
    }

    async findById(id: string): Promise<any> {
        return this.model.findById(id);
    }

    async update(id: string, data: any): Promise<void> {
        await this.model.findByIdAndUpdate(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
}
