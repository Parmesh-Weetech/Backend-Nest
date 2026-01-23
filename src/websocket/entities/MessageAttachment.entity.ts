import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity.js";

@Entity('message_attachments')
export class MessageAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, message => message.attachments, 
    { cascade: true, onDelete: 'CASCADE', onUpdate: "CASCADE" })
    message: Message;

    @Column() 
    mediaId: string;

    @Column() 
    mimeType: string;

    @Column({ nullable: true })
    order: number;
}