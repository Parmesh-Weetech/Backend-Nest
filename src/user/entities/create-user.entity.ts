import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string
}