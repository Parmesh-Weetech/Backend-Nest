export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface IProductRepository {
    findAll(
        skip: number,
        take: number,
        search?: string,
        filter?: {
            _cuisine?: string[];
            _price?: [number, number];
        },
        sort?: string,
        order?: 'ASC' | 'DESC',
    ): Promise<{ items: any[]; total: number }>;

    findOne(id: string): Promise<any | null>;

    create(data: any): Promise<any>;

    insertBulk(data: any[]): Promise<any[]>;

    update(id: string, data: any): Promise<any>;

    softDeleteByUser(userId: string): Promise<number>;

    softDeleteById(id: string): Promise<boolean>;
}
