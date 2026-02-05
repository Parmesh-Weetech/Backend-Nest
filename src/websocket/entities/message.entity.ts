import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../user/entities/user.entity";

import { Conversation } from "./conversation.entity";
import { MessageAttachment } from "./MessageAttachment.entity";

export enum MessageType {
    TEXT = 'text',
    MEDIA = 'media'
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "text", nullable: true })
    content: string | null;

    @Column({ type: 'enum', default: MessageType.TEXT, enum: MessageType })
    type: MessageType;

    @OneToMany(() => MessageAttachment, attachment => attachment.message)
    attachments: MessageAttachment[];

    @ManyToOne(() => Conversation)
    conversation: Conversation;

    @ManyToOne(() => User)
    sender: User;

    @CreateDateColumn()
    createdAt: Date;
}