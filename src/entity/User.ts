import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import type { Profile } from "./Profile";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: "parmesh" })
    name: string
    
    @OneToOne("Profile", (profile: Profile) => profile.user)
    @JoinColumn()
    profile: Profile
}
