import { Conversation } from './entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { User } from '../user/entities/user.entity';

export const WEBSOCKET_REPOSITORY = 'WEBSOCKET_REPOSITORY';

export type WebsocketConversation = Pick<Conversation, 'id' | 'createdAt'> & {
    user1: Pick<User, 'id'>;
    user2: Pick<User, 'id'>;
};

export type WebsocketMessage = Pick<Message, 'id' | 'content' | 'type' | 'createdAt'> & {
    conversation: Pick<Conversation, 'id'>;
    sender: Pick<User, 'id' | 'name'>;
    attachments?: MessageAttachment[];
};

export type CreateMessageInput = {
    content?: string | null;
    type: MessageType;
    conversation: Pick<Conversation, 'id'>;
    sender: Pick<User, 'id' | 'name'>;
};

export type CreateAttachmentInput = {
    message: Pick<Message, 'id'>;
    media: any;
    mediaType: MessageAttachment['mediaType'];
    mimeType: string;
    order: number;
    url?: string;
};

export interface IWebsocketRepository {
    findConversation(userId: string, otherUserId: string): Promise<WebsocketConversation | null>;
    createConversation(userId: string, otherUserId: string): Promise<WebsocketConversation>;

    findMessages(conversationId: string, skip: number, take: number): Promise<WebsocketMessage[]>;

    createMessage(data: CreateMessageInput): Promise<WebsocketMessage>;
    saveMessage(message: WebsocketMessage): Promise<WebsocketMessage>;

    createAttachments(data: CreateAttachmentInput[]): Promise<MessageAttachment[]>;

    findUserById(userId: string): Promise<User | Pick<User, 'id' | 'name'> | null>;

    findConversationById(conversationId: string): Promise<WebsocketConversation | null>;
}
