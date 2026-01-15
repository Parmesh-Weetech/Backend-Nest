import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity.js";
import { User } from "../../user/entities/user.entity.js";

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

    @ManyToOne(() => Conversation)
    conversation: Conversation;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    receiver: User;

    @CreateDateColumn()
    createdAt: Date;
}