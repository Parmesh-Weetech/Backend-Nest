import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MessageType } from "./message.entity";
import { User } from "../../user/entities/user.entity";
import { ChatRoom } from "./chatRoom.entity";

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ type: 'enum', enum: MessageType })
    type: MessageType;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => ChatRoom)
    room: ChatRoom;

    @CreateDateColumn()
    createdAt: Date;
}