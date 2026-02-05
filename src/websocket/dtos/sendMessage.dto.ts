import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

import { MessageType } from "../entities/message.entity";
import { MediaType } from "../entities/MessageAttachment.entity";

export class SendMessageDto {
    @IsString()
    @IsUUID("all", { each: true })
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsNotEmpty()
    type: MessageType;

    @IsOptional()
    @IsUUID("all", { each: true })
    attachments?: { id?: string, url?: string, media: { id: string }, mimeType: string, mediaType: MediaType }[];
}