export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any | null>;

    findByKeyAndOrganization(
        key: string,
        organizationId: string,
    ): Promise<any[]>;

    create(data: any): Promise<any>;
    update(id: string, data: Partial<any>): Promise<any>;
    softDelete(id: string): Promise<boolean>;

    findGlobalRoleByKey(key: string): Promise<any | null>;
}
