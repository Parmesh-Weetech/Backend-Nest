import type { Request, Response, NextFunction } from "express";
import { Role } from "../models/roleModel.ts";
import { user_role } from "../config/roleConfig.ts";
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
    const role = req.session.role

    const roleData = await Role.findOne({ _id: role });

    if(!roleData) {
        res.status(400).json({ message: "Invalid Request"});
    }

    if (user_role.includes(roleData!.name)) {
        return res.status(401).json({
            message: "Unauthorized access! Only Admin can access it."
        })
    } else {
        next();
    }
}

export const checkPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const permissionsIds = req.session.permissions;

    const permissions = await permissionsIds.map(async (permission: string) => {
        const p = await Permission.findOne({ permission: permission });
        return p?.name;
    })

    let isInclude = false;

    for (const name in permissions) {
        if (createUser.includes(name)) {
            isInclude = true;
            break;
        }
    }

    if (req.url === "/admin/user/create" && isInclude) {
        next();
    }

    res.status(401).json({ message: "Unauthorized access!" });
}