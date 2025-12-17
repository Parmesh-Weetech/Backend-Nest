import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.js";


@Entity()
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    bio: string

    @OneToOne("User", (user: User) => user.profile)
    user: User
}