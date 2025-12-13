import type { Request, DecoratorResponse } from "./models.js";
import { APIResponse as res } from "./models.js";

function Private(req: Request) {
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

    const target = function (target: Function) {};

    return target;
}

function LoginRequired(req: Request)  {
    if (req.url == "/api" && req.headers.hasOwnProperty("authorization") && req.headers.authorization === "Bearer token") {
        console.log("User is logged in, access granted.");
    } else {
        res.status = 401;
        res.body = "login is require to access this route.";
        console.log("login is require to access this route.");
    }

    const target = function (target: Function) {};

    return target;
}

function Public(req: Request) {
    if (req.url === "/public") {
        console.log("Accessing public route.");
    } else {
        res.status = 404;
        res.body = "This is not a public route.";
        console.log("This is not a public route.");
    }

    const target = function (target: Function) {};

    return target;
}

export { Private, LoginRequired, Public };
