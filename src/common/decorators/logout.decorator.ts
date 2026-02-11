import { SetMetadata } from '@nestjs/common';

export const IS_LOGOUT_REQUEST = 'IS_LOGOUT_REQUEST';
export const LogoutRequest = () => SetMetadata(IS_LOGOUT_REQUEST, true);