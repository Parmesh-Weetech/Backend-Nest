import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../../user/user.service.js";
import { PermissionService } from "../../permission/permission.service.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly permissionService: PermissionService
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

        const hasPermission = user.roles.some((role) => {
            if (role.organization.id !== orgId) {
                return false;
            }

            const match = role.permissions.some(async (permission) => {
                permission = await this.permissionService.findOne(permission.id)
                if (permission.organization.id !== orgId) {
                    return false;
                }

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

                return false;
            });

            return match;
        });

        if (!hasPermission) {
            throw new ForbiddenException(
                `You are not authorized to ${action} ${entity}`,
            );
        }

        return true;
    }
}
