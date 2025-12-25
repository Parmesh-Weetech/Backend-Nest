import type { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: UUID

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string
}