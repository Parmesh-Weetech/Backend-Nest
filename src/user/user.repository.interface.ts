import { APIResponse } from "src/common/response/response.dto";

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface IUserRepository {
    create(data: any): Promise<any>;
    findAll(userId: string): Promise<any[]>;
    findOne(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<boolean>;
    findOneWithRolesAndPermissions(userId: string): Promise<APIResponse>;
    findByOrgAndEmail(orgId: string, email: string): Promise<APIResponse>;
}
