import { Injectable } from "@nestjs/common";
import { IPermissionRepository } from "./permission.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { PermissionDocument } from "./schemas/permission.schema";
import { Model } from "mongoose";

@Injectable()
export class MongoPermissionRepository
    implements IPermissionRepository {
    constructor(
        @InjectModel(PermissionDocument.name)
        private readonly model: Model<PermissionDocument>,
    ) { }

    findAll() {
        return this.model.find({ deleted_at: null });
    }

    findById(id: string) {
        return this.model.findOne({ _id: id, deleted_at: null });
    }

    findByEntityActionAndOrg(entity: string, action: string, organizationId: string) {
        return this.model.findOne({
            entity,
            action,
            organization: organizationId,
            deleted_at: null,
        });
    }

    create(data: any) {
        return this.model.create(data);
    }

    update(id: string, data: any) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async softDelete(id: string) {
        const res = await this.model.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });
        return !!res;
    }

    findByRoleId(roleId: string) {
        return this.model.find({
            roles: { $in: [roleId] },
            deleted_at: null,
        });
    }
}
