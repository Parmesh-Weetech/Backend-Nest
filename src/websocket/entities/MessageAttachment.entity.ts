import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity.js";
import { Files } from "../../files/entities/File.entity.js";
import { Expose } from "class-transformer";

@Entity('message_attachments')
export class MessageAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, message => message.attachments, 
    { cascade: true, onDelete: 'CASCADE', onUpdate: "CASCADE" })
    message: Message;

    @ManyToOne(() => Files, {
        nullable: false,
        cascade: true,
        onUpdate: "CASCADE",
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'mediaId' })
    media: Files;

    @Column() 
    mimeType: string;

    @Column({ nullable: true })
    order: number;

    @Expose()
    url?: string;
}