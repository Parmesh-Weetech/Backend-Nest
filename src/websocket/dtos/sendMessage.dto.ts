import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { MessageType } from "../entities/message.entity.js";

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
    attachments?: string[];
}