import { Expose } from "class-transformer";
import { User } from "../entities/create-user.entity";
import type { UUID } from "crypto";

export class UserDTO {
    @Expose()
    name: string

    @Expose()
    email: string
}

export class AdminUserDTO {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    email: string

    @Expose()
    password: string
}