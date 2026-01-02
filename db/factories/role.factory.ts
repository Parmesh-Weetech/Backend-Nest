import { Role } from "../../src/role/entities/role.entity.js";
import { setSeederFactory } from "typeorm-extension";

export const RoleFactory = setSeederFactory(Role, () => {
    const role = new Role();

    role.key = 'admin';
    role.label = 'Admin';
    role.description = 'Full system access'

    return role;
});