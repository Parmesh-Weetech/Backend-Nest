import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
        const requiredPermission = this.reflector.get<string>(
            'permission',
            context.getHandler(), // current function if current route was create function then it contain create function, update route for update
        );

        if (!requiredPermission) return true; // No permission required, allow access

        // 2️⃣ Get the current user from the request
        const user = await this.userService.findOne(request.session.userId);
        const role = await this.roleService.findOne(user.roleId)
        const permission = await this.permissionService.findOne(role.id)

        // 3️⃣ Check if user's role's permission matches the required permission
        return permission.name === requiredPermission;
    }
}
