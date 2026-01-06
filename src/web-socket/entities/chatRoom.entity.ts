import { IsOptional } from "class-validator";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => User)
    @JoinTable()
    members: User[];
}
