import { Private, LoginRequired, Public } from "./Decorators.js";

// Using the decorators
@Private({
    url: "/admin",
    headers: {
        authorization: "Bearer token",
    },
    role: "admin",
})
class AdminRoute { }

@LoginRequired({
    url: "/api",
    headers: {
        authorization: "Bearer token",
    },
})
class ApiRoute { }

@Public({
    url: "/publi",
    headers: {
        authorization: "Bearer token",
    },
})
class PublicApi { }
