import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Auth } from '../util/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly auth: Auth
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if (publicRoute) return true;

        const request = context.switchToHttp().getRequest();

        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) throw new UnauthorizedException("You must be logged in.");

        const isValid = await this.auth.verify(access_token);

        if (!isValid) throw new UnauthorizedException({ message: "Token expired.", expired: true });

        return true;

    }
}