import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth } from '../util/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly auth: Auth
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if (publicRoute) return true;

        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) {
            response.status(404).json({
                success: false,
                data: null,
                expired: false,
                message: 'Token is required!',
                statusCode: 404,
            });
            return false;
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) {
            response.status(400).json({
                success: false,
                data: null,
                expired: true,
                message: 'Token is expired!',
                statusCode: 400,
            });
            return false;
        }

        if(isValid && access_token) return true; 

        response.status(401).json({
            success: false,
            data: null,
            expired: false,
            message: "You must be logged in!",
            statusCode: 401
        })

        return false;
    }
}