export const ORGANIZATION_REPOSITORY = 'ORGANIZATION_REPOSITORY';

export interface IOrganizationRepository {
    findAllByUser(userId: string): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    create(data: any): Promise<any>;
    update(id: string, data: Partial<any>): Promise<any>;
    softDelete(id: string): Promise<boolean>;
}
