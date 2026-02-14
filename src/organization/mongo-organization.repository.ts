import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

    async findAllByUser(userId: string) {
        const documents = await this.model.find({
            users: { $in: [userId] }
        }).lean().exec();

        return documents.map((document: any) => this.toPlain(document));
    }

    async findById(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            console.log("document");
            return null;
        }

        const document = await this.model.findOne({ _id: id }).lean().exec();
        return this.toPlain(document);
    }

    async create(data: any) {
        const organization = new this.model(data);
        const saved = await organization.save();
        return this.toPlain(saved);
    }

    async update(id: string, data: any) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.model.findByIdAndUpdate(id, data, { new: true }).lean().exec();
        return this.toPlain(document);
    }

    async softDelete(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return false;
        }

        const res = await this.model.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });
        return !!res;
    }
}
