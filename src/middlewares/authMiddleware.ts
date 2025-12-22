import type { Request, Response, NextFunction } from "express";
import { Role } from "../models/roleModel.ts";

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

    if (roleData?.name !== "ADMIN" && roleData?.name !== "SYSTEM") {
        return res.status(401).json({
            message: "Unauthorized access! Only Admin can access it."
        })
    } else {
        next();
    }
}