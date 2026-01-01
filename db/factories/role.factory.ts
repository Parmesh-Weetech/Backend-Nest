import { Role } from "../../src/role/entities/role.entity.js";
import { setSeederFactory } from "typeorm-extension";

export const RoleFactory = setSeederFactory(Role, () => {
    const role = new Role();

    role.key = 'abcd';
    role.label = 'abcd';
    role.description = 'Full system access'

    return role;
});