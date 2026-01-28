import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity.js";
import { User } from "../../user/entities/user.entity.js";
import { MessageAttachment } from "./MessageAttachment.entity.js";

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    EMOJI = 'emoji',
    FILE = 'file'
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "text", nullable: true })
    content: string | null;

    @Column({ type: 'enum', enum: MessageType })
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