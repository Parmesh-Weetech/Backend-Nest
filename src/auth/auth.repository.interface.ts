export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<any | null>;
    findUserByEmailAndOrg(email: string, orgId: string): Promise<any>;
    findUserById(id: string): Promise<any | null>;
    createUser(data: any): Promise<any>;

    saveRefreshToken(userId: string, token: string): Promise<void>;
    findRefreshToken(token: string): Promise<any | null>;
    updateRefreshToken(id: string, newToken: string): Promise<boolean>;
    deleteRefreshToken(userId: string, token: string): Promise<boolean>;
}
