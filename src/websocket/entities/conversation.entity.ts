import { User } from "../../user/entities/user.entity.js";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('conversations')
@Unique(['user1', 'user2'])
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user1: User;

    @ManyToOne(() => User)
    user2: User;

    @CreateDateColumn()
    createdAt: Date;
}