import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../user/user.service';
import { Auth } from '../util/auth';

@Injectable()
export class PermissionsMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly auth: Auth,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.headers.cookie;
            if (!authorization) throw new UnauthorizedException({ message: "Unauthorized access!" });

            const [key, value] = authorization.split('=');
            if (key !== 'token' || !key || !value) throw new UnauthorizedException({ message: 'Invalid token format'});

            const [type, access_token] = value.split(' ');

            const token = type === "Bearer" ? access_token : undefined
            if (!token) throw new UnauthorizedException({ message: "Token is required"})

            const isValid = await this.auth.verify(token);
            if (!isValid) throw new UnauthorizedException({ message: 'Token expired!', expired: true });

            const decodedPayload = await this.auth.decode(token);

            const user = await this.userService.findOne(decodedPayload.sub);
            if (!user) throw new NotFoundException('User not found');

            const hasAccess = user.data.roles.some(role => {
                if (role.key !== 'admin') return false;

                return role.permissions.some(permission => {
                    return permission.entity === 'board' &&
                        permission.action === 'all' &&
                        permission.organization === null
                }
                );
            });

            if (!hasAccess) throw new ForbiddenException('You are not authorized to access Bull Board');

            return next();

        } catch (err) {
            return res.status(403).json({ status: err.status, message: err.message });
        }
    }
}
