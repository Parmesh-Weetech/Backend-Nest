import { Injectable } from "@nestjs/common";
import { IPermissionRepository } from "./permission.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { PermissionDocument } from "./schemas/permission.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class MongoPermissionRepository
    implements IPermissionRepository {
    constructor(
        @InjectModel(PermissionDocument.name)
        private readonly model: Model<PermissionDocument>,
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

        const document = await this.model.findOne({ _id: id }).lean().exec();
        return this.toPlain(document);
    }

    async findByKeyAndOrg(key: string, organizationId: string) {
        const document = await this.model.findOne({
            key,
            organization: organizationId,
        }).lean().exec();

        return this.toPlain(document);
    }

    async findByEntityActionAndOrg(entity: string, action: string, organizationId: string) {
        const document = await this.model.findOne({
            entity,
            action,
            organization: organizationId,
        }).lean().exec();

        return this.toPlain(document);
    }

    async create(data: any) {
        const document = new this.model(data);
        const saved = await document.save();
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
        const res = await this.model.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });
        return !!res;
    }

    async findByRoleId(roleId: string) {
        const documents = await this.model.find({
            roles: { $in: [roleId] },
        }).lean().exec();

        return documents.map((document: any) => this.toPlain(document));
    }
}
