import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { Auth } from '../util/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly auth: Auth) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.cookie;
            if (!authorization) throw new UnauthorizedException({message: 'Unauthorized access!'});

            const [key, value] = authorization.split('=');
            if (key !== 'token' || !key || !value) throw new UnauthorizedException({ message: 'Invalid token format'});

            const [type, access_token] = value.split(' ');
            
            const token = type === "Bearer" ? access_token : undefined
            if(!token) throw new UnauthorizedException({ message: "Unauthorized access!"});

            const isValid = await this.auth.verify(token);
            if (!isValid) throw new UnauthorizedException({ message: 'Token expired!'});

            return next();
        } catch (err) {
            return res.status(401).json({ status: err.status, message: err.message });
        }
    }
}
