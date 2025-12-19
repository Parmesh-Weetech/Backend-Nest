import type { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session.userId || !req.session.authId || req.session.authId.length !== 8 || !req.session.csrfToken) {
        return res.status(401).json({
            message: "Session expired or user not logged in"
        });
    }
    next();
};
