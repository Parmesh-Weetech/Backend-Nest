import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';

export interface PermissionMeta {
    entity: string;
    action: string;
}

export const Permission = (entity: string, action: string) => {
    return SetMetadata(PERMISSIONS_KEY, { entity, action } as PermissionMeta);
};
