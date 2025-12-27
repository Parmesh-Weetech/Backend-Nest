import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';

export const Permission = (...permissions: string[]) => {
    return SetMetadata(PERMISSIONS_KEY, permissions);
}