import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { MessageType } from "../entities/message.entity";

export class SendChatMessageDto {
    @IsString()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    roomId: string;

    @IsString()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    senderId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type: MessageType;
}
