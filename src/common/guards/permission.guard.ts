import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../../user/user.service.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
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

        const user = await this.userService.findOneWithRolesAndPermissions(
            request.session.userId,
        );

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const orgId = user.organization.id;

        for (const role of user.roles) {
            // role must belong to same org
            if (role.organization.id !== orgId) continue;

            for (const permission of role.permissions) {
                // permission must belong to same org
                if (permission.organization.id !== orgId) continue;

                // exact match
                if (
                    permission.entity === entity &&
                    permission.action === action
                ) {
                    return true;
                }

                // admin wildcard
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
