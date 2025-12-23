import type { Request, Response, NextFunction } from "express";
import { Role } from "../models/roleModel.ts";
import { userRoute, ROUTE_PERMISSIONS, roleRoute, permissionRoute } from "../config/routeConfig.ts";
import { Permission } from "../models/permissionModel.ts";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session.userId || !req.session._csrfToken) {
        return res.status(401).json({
            message: "Session expired or user not logged in"
        });
    }
    next();
};

export const checkRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const roleId = req.session.roleId;
    const userId = req.session.userId;

    const roleData = await Role.findOne({ _id: roleId });

    if (!roleData) {
        return res.status(401).json({ message: "Unauthorized access!" });
    }

    const permissions = await Promise.all(
        roleData.permissionsIds.map(async (permissionId) => {
            const permission = await Permission.findOne({ _id: permissionId });
            return permission?.name.toUpperCase();
        })
    );  

    console.log(req.originalUrl);
    console.log(roleData!.name);
    console.log(roleData!.name !== "ADMIN");
    console.log(userRoute.includes(req.originalUrl));
    
    if ((userRoute.includes(req.originalUrl) || (roleRoute.includes(req.originalUrl)) || (permissionRoute.includes(req.originalUrl))) && roleData!.name !== "ADMIN" && roleData!.name !== "SYSTEM") {
        return res.status(403).json({
            message: `Unauthorized access! Only Admin and System roles can access it: Role is ${roleData!.name}`
        });
    } else if (req.originalUrl.includes("/post/create") && !hasPermission(permissions.filter((p) => p !== undefined) as string[], getRequiredPermissions(req))) {
        return res.status(403).json({
            message: "Unauthorized! You don't have permission to create posts."
        });
    } else {
        next();
    }
}

function getRequiredPermissions(req: Request): string[] {
    const key = `${req.method} ${req.baseUrl}${req.route?.path ?? ""}`;
    return ROUTE_PERMISSIONS[key] || [];
}

function hasPermission(
    rolePermissions: string[],
    requiredPermissions: string[]
): boolean {
    return rolePermissions.some(p => requiredPermissions.includes(p));
}
