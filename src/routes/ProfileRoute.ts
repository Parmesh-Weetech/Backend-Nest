import { ProfileController } from "../controller/ProfileController.js";

export const ProfileRoute = [{
    method: "post",
    route: "/profile",
    controller: ProfileController,
    action: "save"
}]