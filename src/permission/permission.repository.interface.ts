export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';

export interface IPermissionRepository {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any | null>;

    findByEntityActionAndOrg(
        entity: string,
        action: string,
        organizationId: string, 
    ): Promise<any | null>;

    create(data: any): Promise<any>;
    update(id: string, data: Partial<any>): Promise<any>;
    softDelete(id: string): Promise<boolean>;

    findByRoleId(roleId: string): Promise<any[]>;
}
