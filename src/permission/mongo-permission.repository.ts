import { Injectable } from "@nestjs/common";
import { IPermissionRepository } from "./permission.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { PermissionDocument } from "./schemas/permission.schema";
import { Model, Types } from "mongoose";
import { RoleDocument } from "../role/schemas/role.schema";

@Injectable()
export class MongoPermissionRepository
    implements IPermissionRepository {
    constructor(
        @InjectModel(PermissionDocument.name)
        private readonly model: Model<PermissionDocument>,
        @InjectModel(RoleDocument.name)
        private readonly roleModel: Model<RoleDocument>,
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

    async findByEntityAndOrg(entity: string, organizationId: string) {
        const document = await this.model.findOne({
            organization: organizationId,
            entity: entity,
        }).lean().exec();

        return this.toPlain(document);
    }

    async findByPermissionAndOrg(key: string, label: string, entity: string, action: string, organizationId: string) {
        const document = await this.model.findOne({
            key,
            label,
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

    async findGlobalPermissionByKey(key: string): Promise<any> {
        const documents = await this.model
            .find({ key, organization: null, deleted_at: null })
            .lean()
            .exec();

        const roleIds = Array.from(
            new Set(
                documents
                    .flatMap((doc: any) => (Array.isArray(doc.roles) ? doc.roles : []))
                    .map((roleId: any) => String(roleId ?? ''))
                    .filter((roleId: string) => Types.ObjectId.isValid(roleId)),
            ),
        );

        const roles = roleIds.length > 0
            ? await this.roleModel.find({
                _id: { $in: roleIds },
                organization: null,
                deleted_at: null,
            }).lean().exec()
            : [];

        const roleById = new Map<string, any>(
            roles.map((role: any) => [
                role._id.toString(),
                {
                    id: role._id.toString(),
                    key: role.key,
                    label: role.label,
                    description: role.description,
                },
            ]),
        );

        return documents.map((doc: any) => {
            const firstRoleId = Array.isArray(doc.roles) && doc.roles.length > 0
                ? String(doc.roles[0])
                : '';
            const role = roleById.get(firstRoleId);

            return this.toPlain({
                ...doc,
                roles: role,
            });
        });
    }
}
