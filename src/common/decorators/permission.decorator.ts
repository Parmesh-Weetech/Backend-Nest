import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';

export interface PermissionMeta {
    role_key: string;
    entity: string;
    action: string;
}

export const Permission = (role_key: string, entity: string, action: string) => {
    return SetMetadata(PERMISSIONS_KEY, { role_key, entity, action } as PermissionMeta);
};
