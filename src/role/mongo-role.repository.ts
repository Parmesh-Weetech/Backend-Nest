import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoleDocument } from "./schemas/role.schema";
import { IRoleRepository } from "./role.repository.interface";
import { Model } from "mongoose";

@Injectable()
export class MongoRoleRepository implements IRoleRepository {
    constructor(
        @InjectModel(RoleDocument.name)
        private readonly model: Model<RoleDocument>,
    ) { }

    findAll() {
        return this.model.find();
    }

    findById(id: string) {
        return this.model.findOne({ _id: id });
    }

    findByKeyAndOrganization(key: string, organizationId: string) {
        return this.model.find({
            key,
            organization: organizationId
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

    findGlobalRoleByKey(key: string) {
        return this.model.findOne({
            key,
            organization: null
        });
    }
}
