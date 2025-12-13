import type { APIResponse, Request } from "../models/authentication-model.ts";

export function authenticationMiddleware(req: Request, res: APIResponse, next?: Function) {
    // Check if the request is for a public route
    if (req.url === "/public") {
        console.log("Accessing public route.");
        res.status = 200;
        res.body = "Public route - no authentication required";
    } 
    // Check if the request is for a private route
    else if (req.url === "/private" && req.headers.authorization === "Bearer token") {
        console.log("User is logged in, access granted.");
        res.status = 200;
        res.body = "Private route - authentication required";
    } 
    // Check if the request is for an admin route
    else if (req.url === "/admin" && req.headers.authorization === "Bearer token" && req.role === "admin") {
        console.log("Access granted to admin route.");
        res.status = 200;
        res.body = "Admin route - admin privileges required";
    } 
    // If none of the above conditions are met, return an error response
    else {
        if (req.url === "/private" || req.url === "/admin") {
            res.status = 403;
            res.body = "Access denied. Admins only.";
        } else {
            res.status = 404;
            res.body = "This is not a public route.";
        }
        console.log("Access denied.");
    }
    
    // Call the next middleware or route handler
    next && next();
}