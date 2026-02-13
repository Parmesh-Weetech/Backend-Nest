export const POSTS_REPOSITORY = 'POSTS_REPOSITORY';

export interface IPostRepository {
    create(data: any): Promise<any>;
    findAll(userId: string): Promise<any[]>;
    findOne(id: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<boolean>;
}
