export const FILES_REPOSITORY = 'FILES_REPOSITORY';

export interface IFilesRepository {
    create(data: any): Promise<any>;

    findById(id: string): Promise<any | null>;

    findByIdWithUser(id: string): Promise<any | null>;

    findByUser(userId: string): Promise<any[]>;

    update(id: string, data: any): Promise<any>;

    delete(id: string): Promise<boolean>;
}
