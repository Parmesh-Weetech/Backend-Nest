import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Auth } from '../util/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly auth: Auth,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler(),
        );

        if (isPublic) return true;

        const isRefreshTokenRequest = this.reflector.get<boolean>(
            'IS_REFRESH_TOKEN_REQUEST',
            context.getHandler(),
        );

        if (isRefreshTokenRequest) return true;

        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }

        const isValid = await this.auth.verify(token);
        if (!isValid) {
            throw new UnauthorizedException({ message: 'Token expired', expired: true });
        }

        const payload = await this.auth.decode(token);

        request.auth = payload;
        
        return true;
    }
}