import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expose } from "class-transformer";

import { Files } from "../../files/entities/File.entity";
import { Video } from "../../video/entities/video.entity";

import { Message } from "./message.entity";

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    APPLICATION = 'application'
}

@Entity('message_attachments')
export class MessageAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, message => message.attachments, 
    { cascade: true, onDelete: 'CASCADE', onUpdate: "CASCADE" })
    message: Message;

    @ManyToOne(() => Files, {
        nullable: true,
        cascade: true,
        onUpdate: "CASCADE",
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'mediaId' })
    media: Files | Video;

    @Column({ 
        type: 'enum', 
        default: MediaType.IMAGE, 
        enum: MediaType,
        enumName: 'message_attachment_media_type_enum',
    })
    mediaType: MediaType

    @Column() 
    mimeType: string;

    @Column({ nullable: true })
    order: number;

    @Expose()
    url: string;
}