import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../../user/user.service.js";
import { JwtService } from "@nestjs/jwt";
import { Auth } from "../util/auth.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly auth: Auth
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const requiredPermission = this.reflector.get<{
            entity: string;
            action: string;
        }>('PERMISSIONS_KEY', context.getHandler());

        if (!requiredPermission) {
            return true;
        }

        const { entity, action } = requiredPermission;

        const authorization = request.headers.authorization;
        const token = authorization.split(' ')[1];

        const isValid = await this.auth.verify(token);

        if (!isValid) {
            throw new UnauthorizedException('Invalid token');
        }

        const decodedPayload = await this.auth.decode(token)

        const user = await this.userService.findOneWithRolesAndPermissions(
            decodedPayload.sub,
        );

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const orgId = user.data.organization.id;

        for (const role of user.data.roles) {
            if (role.organization.id !== orgId) continue;

            for (const permission of role.permissions) {
                if (permission.organization.id !== orgId) continue;

                if (
                    permission.entity === entity &&
                    permission.action === action
                ) {
                    return true;
                }

                if (
                    role.key === 'admin' &&
                    permission.entity === entity &&
                    permission.action === 'all'
                ) {
                    return true;
                }
            }
        }

        throw new ForbiddenException(
            `You are not authorized to ${action} ${entity}`,
        );
    }
}
