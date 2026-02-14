import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoleDocument } from "./schemas/role.schema";
import { IRoleRepository } from "./role.repository.interface";
import { Model, Types } from "mongoose";

@Injectable()
export class MongoRoleRepository implements IRoleRepository {
    constructor(
        @InjectModel(RoleDocument.name)
        private readonly model: Model<RoleDocument>,
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

    async findAll() {
        const documents = await this.model.find({ deleted_at: null }).lean().exec();
        return documents.map((document: any) => this.toPlain(document));
    }

    async findById(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.model.findOne({ _id: id, deleted_at: null }).lean().exec();
        return this.toPlain(document);
    }

    async findByKeyAndOrganization(key: string, organizationId: string) {
        const documents = await this.model.find({
            key,
            organization: organizationId,
            deleted_at: null,
        }).lean().exec();

        return documents.map((document: any) => this.toPlain(document));
    }

    async create(data: any) {
        const document = await this.model.create(data);
        return this.toPlain(document);
    }

    async update(id: string, data: any) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.model.findByIdAndUpdate(id, data, { new: true }).lean().exec();
        return this.toPlain(document);
    }

    async softDelete(id: string) {
        const res = await this.model.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });
        return !!res;
    }

    async findGlobalRoleByKey(key: string) {
        const document = await this.model.findOne({
            key,
            organization: null,
            deleted_at: null,
        }).lean().exec();

        return this.toPlain(document);
    }
}
