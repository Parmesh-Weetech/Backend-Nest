import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    private normalizeId(value: any): string | null {
        if (!value) return null;

        if (typeof value === 'string') return value;

        if (typeof value === 'object') {
            if (value.id) return String(value.id);
            if (value._id?.toString) return value._id.toString();
        }

        return null;
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const requiredPermission = this.reflector.get<{
            entity: string;
            action: string;
        }>('PERMISSIONS_KEY', context.getHandler());

        if (!requiredPermission) return true;

        const user = request.currentUser;
        if (!user) throw new UnauthorizedException("User not found in request");
        const { entity, action } = requiredPermission;

        const orgId = this.normalizeId(user.organization.id);
        if (!orgId) {
            throw new UnauthorizedException('User organization not found');
        }

        for (const role of (user.roles ?? [])) {
            if (role.key === 'admin') {
                return true;
            }

            if (!role.organization) continue;

            const roleOrgId = this.normalizeId(role.organization);
            if (!roleOrgId || roleOrgId !== orgId) continue;

            const rolePermissions = role.permissions ?? [];
            
            for (const permission of rolePermissions) {
                const permissionOrgId = this.normalizeId(permission.organization);

                if (
                    permissionOrgId === orgId &&
                    permission.entity === entity &&
                    (permission.action === "all" || permission.action === action)
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
