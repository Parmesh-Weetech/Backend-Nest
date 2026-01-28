import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../util/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly auth: Auth) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.cookie;
            if (!authorization) throw new UnauthorizedException('No authorization header');

            const [key, value] = authorization.split('=');
            if (key !== 'token' || !key || !value) throw new UnauthorizedException('Invalid token format');

            const [type, access_token] = value.split(' ');
            const token = type === "Bearer" ? access_token : undefined

            if(!token) throw new UnauthorizedException("Token is required")

            const isValid = await this.auth.verify(token);
            if (!isValid) throw new UnauthorizedException('Invalid token');

            return next();
        } catch (err) {
            return res.status(401).json({ status: err.status, message: err.message });
        }
    }
}
