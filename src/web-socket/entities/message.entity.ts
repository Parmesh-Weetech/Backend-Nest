import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity";
import { User } from "../../user/entities/user.entity";

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    EMOJI = 'emoji',
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ type: 'enum', enum: MessageType })
    type: MessageType;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => Conversation)
    conversation: Conversation;

    @CreateDateColumn()
    createdAt: Date;
}