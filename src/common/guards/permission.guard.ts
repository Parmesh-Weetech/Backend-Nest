import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../../permission/permission.service.js';
import { UserService } from '../../user/user.service.js';
import { OrganizationService } from '../../organization/organization.service.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly permissionService: PermissionService,
        private readonly organizationService: OrganizationService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const requiredPermission = this.reflector.get<{
            entity: string;
            action: string;
        }>('PERMISSIONS_KEY', context.getHandler());

        if (!requiredPermission) return true;

        const user = await this.userService.findOne(
            request.session.userId,
        );

        if (!user || !user.roles || user.roles.length === 0) {
            throw new ForbiddenException(
                'You are not authorized to perform this action.',
            );
        }

        const role = user.roles.map((role) => {
            console.log(role.organization.id, " ", user.organization.id)
            const match = role.organization.id === user.organization.id;

            if(match) return role
        })

        console.log(role);

        // const roleIds: string[] = [];
        // const roleKeys: string[] = [];

        // for (const role of user.roles) {
        //     roleIds.push(role.id);
        //     roleKeys.push(role.key);
        // }

        // if (roleKeys.includes('admin') || roleKeys.includes('system')) {
        //     return true;
        // }

        // const permissionsByRole = await Promise.all(
        //     roleIds.map((roleId) =>
        //         this.permissionService.findByRoleId(roleId),
        //     ),
        // );

        // const permissions = permissionsByRole.flat();

        // if (!permissions.length) {
        //     throw new ForbiddenException(
        //         'You are not authorized to perform this action.',
        //     );
        // }

        // const authorized = permissions.some((permission) => {
        //     if (
        //         permission.entity === 'all' &&
        //         permission.action === 'all' &&
        //         roleKeys.includes(requiredPermission.role_key)
        //     ) {
        //         return true;
        //     }

        //     return (
        //         roleKeys.includes(requiredPermission.role_key) &&
        //         permission.entity === requiredPermission.entity &&
        //         permission.action === requiredPermission.action
        //     );
        // });

        // if (!authorized) {
        //     throw new ForbiddenException(
        //         'You are not authorized to perform this action!',
        //     );
        // }

        return true;
    }
}
