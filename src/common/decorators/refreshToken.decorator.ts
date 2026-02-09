import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH_TOKEN_REQUEST = 'IS_REFRESH_TOKEN_REQUEST';
export const RefreshTokenRequest = () => SetMetadata(IS_REFRESH_TOKEN_REQUEST, true);