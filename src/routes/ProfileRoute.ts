import { ProfileController } from "../controller/ProfileController.js";

export const ProfileRoute = [{
    method: "post",
    route: "/profile",
    controller: ProfileController,
    action: "save"
}, {
    method: "put",
    route: "/profile",
    controller: ProfileController,
    action: "update"
}, {
    method: "get",
    route: "/profile",
    controller: ProfileController,
    action: "all"
}, {
    method: "get",
    route: "/profile/:id",
    controller: ProfileController,
    action: "getOne"
}]