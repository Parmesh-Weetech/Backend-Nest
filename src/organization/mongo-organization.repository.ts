import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    IOrganizationRepository,
} from './organization.repository.interface';
import { OrganizationDocument } from './schemas/organization.schema';

@Injectable()
export class MongoOrganizationRepository
    implements IOrganizationRepository {
    constructor(
        @InjectModel(OrganizationDocument.name)
        private readonly model: Model<OrganizationDocument>,
    ) { }

    async findAllByUser(userId: string) {
        return this.model.find({
            users: { $in: [userId] },
            deleted_at: null,
        });
    }

    async findById(id: string) {
        return this.model.findOne({ _id: id, deleted_at: null });
    }

    async create(data: any) {
        return this.model.create(data);
    }

    async update(id: string, data: any) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async softDelete(id: string) {
        const res = await this.model.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });
        return !!res;
    }
}
