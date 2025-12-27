import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly userService: UserService, private readonly roleService: RoleService, private readonly permissionService: PermissionService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // 1️⃣ Get the required permission from the route metadata
        const requiredPermission = this.reflector.get<string[]>(
            'PERMISSIONS_KEY',
            context.getHandler(), // current function if current route was create function then it contain create function, update route for update
        );

        if (!requiredPermission || requiredPermission.length === 0) return true; // No permission required, allow access

        // 2️⃣ Get the current user from the request
        const user = await this.userService.findOne(request.session.userId);
        if (!user) throw new ForbiddenException('You are not authorized perform this action.');

        const role = await this.roleService.findOne(user.roleId)
        if (!role) throw new ForbiddenException('You are not authorized perform this action.');

        const permissions = await this.permissionService.findByRoleId(role.id);

        if (!permissions) throw new ForbiddenException('You are not authorized perform this action.');

        // 3️⃣ Check if user's role's permission matches the required permission
        const authorized = requiredPermission.some(required =>
            permissions.includes(required)
        );

        if(!authorized) {
            throw new ForbiddenException('You are not authorized perform this action.');
        }

        return true;
    }
}
