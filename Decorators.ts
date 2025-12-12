import type { privateRequest, loginRequiredRequest, publicRouteRequest } from "./models.ts";

function Private(req: privateRequest) {
  return function (target: Function) {
    if (req.url === "/admin" && req.headers.hasOwnProperty("authorization")) {
      console.log("Access granted to admin route.");
    } else {
      console.log("Access denied. Admins only.");
    }
  };
}

function LoginRequired(req: loginRequiredRequest) {
    return function (target: Function) {
        if(req.url === "/api" && !req.headers.hasOwnProperty("authorization")) {
            console.log("login is require to access this route.");
        } else {
            console.log("User is logged in, access granted.");
        }
    }
}

function Public(req: publicRouteRequest) {
    if(req.url === "/public") {
        console.log("Accessing public route.");
    } else {
        console.log("This is not a public route.");
    }
}

export { Private, LoginRequired, Public };