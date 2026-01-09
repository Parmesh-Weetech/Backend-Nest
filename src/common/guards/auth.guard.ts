import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if (publicRoute) return true;

        const request = context.switchToHttp().getRequest();

        if (request.session?.userId) return true;

        throw new UnauthorizedException('You must be logged in.');
    }
}