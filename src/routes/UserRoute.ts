import { UserController } from "../controller/UserController.js"
import { UserController_Join } from "../controller/UserController_Join.js"

export const UserRoutes = [{
    method: "get",
    route: "/users",
    controller: UserController_Join,
    action: "getView" // getting view entries can be replaced with actual function.
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController_Join,
    action: "getOne"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "put",
    route: "/users",
    controller: UserController,
    action: "update"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}]