import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("refresh_token")
export class Refresh_token {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, user => user.tokens, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    user: User

    @Column()
    refresh_token: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}