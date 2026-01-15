import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { MessageType } from "../entities/message.entity.js";

export class SendMessageDto {
    @IsString()
    @IsUUID("all", { each: true })
    @IsNotEmpty()
    receiverId: string;

    @IsString()
    @IsUUID("all", { each: true })
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type: MessageType;
}