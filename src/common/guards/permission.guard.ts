import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../../permission/permission.service.js';
import { RoleService } from '../../role/role.service.js';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly userService: UserService, private readonly roleService: RoleService, private readonly permissionService: PermissionService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const requiredPermission = this.reflector.get<{
            role_key: string
            entity: string;
            action: string;
        }>(
            'PERMISSIONS_KEY',
            context.getHandler()
        );

        if (!requiredPermission || requiredPermission === null || requiredPermission === undefined) return true;

        const user = await this.userService.findOne(request.session.userId);
        if (!user) throw new ForbiddenException('You are not authorized perform this action.');

        const roles = await this.roleService.findOne(user.role.id);

        if (!roles) throw new ForbiddenException('You are not authorized perform this action.');
        else if (roles.key == "admin" || roles.key == "system") return true;

        const permissions = await this.permissionService.findByRoleId(user.role.id);
        if (!permissions) throw new ForbiddenException('You are not authorized perform this action.');

        const authorized = permissions.some(permission => {
            if (permission.entity == "all" && permission.action == "all" && (roles.key == "admin" || roles.key == "system" || roles.key === requiredPermission.role_key)) return true;

            return roles.key === requiredPermission.role_key && permission.entity === requiredPermission.entity &&
                permission.action === requiredPermission.action
        });

        if (!authorized) throw new ForbiddenException('You are not authorized perform this action!');

        return true;
    }
}
