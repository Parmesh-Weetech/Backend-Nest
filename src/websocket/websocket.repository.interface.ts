import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessageAttachment } from './entities/MessageAttachment.entity';

export const WEBSOCKET_REPOSITORY = 'WEBSOCKET_REPOSITORY';

export interface IWebsocketRepository {
    findConversation(userId: string, otherUserId: string): Promise<Conversation | null>;
    createConversation(userId: string, otherUserId: string): Promise<Conversation>;

    findMessages(conversationId: string, skip: number, take: number): Promise<Message[]>;

    createMessage(data: Partial<Message>): Promise<Message>;
    saveMessage(message: Partial<Message>): Promise<Message>;

    createAttachments(data: Partial<MessageAttachment>[]): Promise<MessageAttachment[]>;

    findUserById(userId: string): Promise<any>;

    findConversationById(conversationId: string): Promise<Conversation | null>;
}
