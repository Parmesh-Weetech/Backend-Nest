import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserService } from "../../user/user.service";
import { Auth } from "../util/auth";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const requiredPermission = this.reflector.get<{
            entity: string;
            action: string;
        }>('PERMISSIONS_KEY', context.getHandler());

        if (!requiredPermission) return true;

        const user = request.currentUser;
        if (!user) throw new UnauthorizedException();

        const { entity, action } = requiredPermission;
        const orgId = user.organization.id;

        for (const role of user.roles) {
            if (role.organization.id !== orgId) continue;

            if (role.key === 'admin') return true;

            for (const permission of role.permissions) {
                if (
                    permission.organization.id === orgId &&
                    permission.entity === entity &&
                    permission.action === action
                ) {
                    return true;
                }
            }
        }

        throw new UnauthorizedException(
            `You are not authorized to ${action} ${entity}`,
        );
    }
}
