import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { MessageType } from "../entities/message.entity";

export class SendMessageDto {
    @IsString()
    @IsUUID("all", { each: true })
    @IsNotEmpty()
    senderId: string;

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
