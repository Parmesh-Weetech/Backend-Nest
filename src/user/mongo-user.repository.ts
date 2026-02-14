import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserRepository } from './user.repository.interface';
import { User } from './entities/user.entity';
import { APIResponse } from 'src/common/response/response.dto';
import { UserDocument } from './schemas/user.schema';
import { RoleDocument } from '../role/schemas/role.schema';
import { PermissionDocument } from '../permission/schemas/permission.schema';
import { OrganizationDocument } from '../organization/schemas/organization.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserDocument.name) private readonly userModel: Model<any>,
        @InjectModel(RoleDocument.name) private readonly roleModel: Model<any>,
        @InjectModel(PermissionDocument.name) private readonly permissionModel: Model<any>,
        @InjectModel(OrganizationDocument.name) private readonly organizationModel: Model<any>,
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

        const id = raw?._id?.toString?.() ?? String(raw._id ?? raw.id);
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id,
        };
    }

    private async loadOrganization(orgId: any) {
        const id = orgId?.toString?.() ?? orgId;
        if (!id) return null;

        const organization = Types.ObjectId.isValid(id)
            ? await this.organizationModel.findById(id).lean().exec()
            : await this.organizationModel.findOne({ id }).lean().exec();

        if (!organization) return null;

        return this.toPlain(organization);
    }

    private async hydrateUser(user: any) {
        if (!user) return null;

        const roleIds = Array.isArray(user.roles) ? user.roles.map((roleId: any) => roleId?.toString?.() ?? roleId) : [];
        const roles = roleIds.length > 0
            ? await this.roleModel.find({ _id: { $in: roleIds } }).lean().exec()
            : [];

        const hydratedRoles = await Promise.all(
            roles.map(async (role: any) => {
                const permissions = Array.isArray(role.permissionIds) && role.permissionIds.length > 0
                    ? await this.permissionModel.find({ _id: { $in: role.permissionIds } }).lean().exec()
                    : [];

                const roleOrg = await this.loadOrganization(role.organization);

                const hydratedPermissions = await Promise.all(
                    permissions.map(async (permission: any) => {
                        const plainPermission = this.toPlain(permission);
                        return {
                            ...plainPermission,
                            organization: await this.loadOrganization(plainPermission.organization),
                        };
                    }),
                );

                const plainRole = this.toPlain(role);
                return {
                    ...plainRole,
                    organization: roleOrg,
                    permissions: hydratedPermissions,
                };
            }),
        );

        const plainUser = this.toPlain(user);
        const { password, ...safeUser } = plainUser;

        return {
            ...safeUser,
            organization: await this.loadOrganization(plainUser.organization),
            roles: hydratedRoles,
        };
    }

    async create(data: any) {
        const document = new this.userModel(data);
        const saved = await document.save();
        return this.hydrateUser(saved.toObject());
    }

    async findAll(userId: string) {
        let users: any[] = [];
        if (Types.ObjectId.isValid(userId)) {
            users = await this.userModel.find({ _id: { $ne: new Types.ObjectId(userId) } }).lean().exec();
        } else {
            users = await this.userModel.find({ id: { $ne: userId } }).lean().exec();
        }

        return Promise.all(users.map((user: any) => this.hydrateUser(user)));
    }

    async findOne(id: string) {
        const user = await this.userModel.findOne(this.byIdFilter(id)).lean().exec();
        return this.hydrateUser(user);
    }

    async update(id: string, data: any) {
        const user = await this.userModel.findOneAndUpdate(this.byIdFilter(id), data, { new: true }).lean().exec();
        return this.hydrateUser(user);
    }

    async remove(id: string) {
        const result = await this.userModel.deleteOne(this.byIdFilter(id));
        return result.deletedCount > 0;
    }

    async findOneWithRolesAndPermissions(userId: string): Promise<APIResponse> {
        const rawUser = await this.userModel.findOne(this.byIdFilter(userId)).lean().exec();
        const user = await this.hydrateUser(rawUser);

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return {
            success: true,
            data: user,
            expired: false,
            message: "User fetched with roles and permissions successfully.",
            statusCode: 200
        };
    }
}
