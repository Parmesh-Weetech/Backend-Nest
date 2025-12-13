import type { Request, DecoratorResponse } from "../models/authentication-model.ts";
import { APIResponseClass as res } from "../models/authentication-model.ts";

export function Public(req: Request) {
    if (req.url === "/public") {
        console.log("Accessing public route.");
    } else {
        res.status = 404;
        res.body = "This is not a public route.";
        console.log("This is not a public route.");
    }

    return function () {

    }
}

export function Private(req: Request) {
    if (req.url == "/private" && req.headers.hasOwnProperty("authorization") && req.headers.authorization === "Bearer token") {
        console.log("User is logged in, access granted.");
    } else {
        res.status = 401;
        res.body = "login is require to access this route.";
        console.log("login is require to access this route.");
    }

    return function () {

    }
}

export function Admin(req: Request) {
    if (
        req.url === "/admin" &&
        req.headers.hasOwnProperty("authorization") &&
        req.headers.authorization === "Bearer token" &&
        req.role === "admin"
    ) {
        console.log("Access granted to admin route.");
    } else {
        res.status = 403;
        res.body = "Access denied. Admins only.";
        console.log("Access denied. Admins only.");
    }

    return function () {

    }
}