import type { UUID } from "crypto";
import { Column, Entity, EntitySchema, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    firstName: string
}

export const UserSchema = new EntitySchema<User> ({
    name: "user",
    target: User,
    columns: {
        id: {
            type: String,
            primary: true,
            unique: true,
            nullable: false,
            generated: true
        },
        firstName: {
            type: String,
            primary: false,
            unique: false,
            nullable: false,
        }
    }
})

// You can define an entity and its columns right in the model, using decorators. But some people prefer to define entities and their columns inside separate files using the "entity schemas".