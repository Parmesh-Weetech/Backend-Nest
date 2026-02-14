import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAttachmentInput, CreateMessageInput, IWebsocketRepository, WebsocketConversation, WebsocketMessage } from './websocket.repository.interface';
import { ConversationDocument } from './schemas/conversation.schema';
import { MessageDocument } from './schemas/message.schema';
import { MessageAttachment } from './entities/MessageAttachment.entity';

@Injectable()
export class MongoWebsocketRepository implements IWebsocketRepository {
    constructor(
        @InjectModel(ConversationDocument.name)
        private readonly conversationModel: Model<ConversationDocument>,

        @InjectModel(MessageDocument.name)
        private readonly messageModel: Model<MessageDocument>,
    ) { }

    private mapConversation(conversation: ConversationDocument): WebsocketConversation {
        return {
            id: conversation._id.toString(),
            user1: { id: conversation.user1Id },
            user2: { id: conversation.user2Id },
            createdAt: conversation.createdAt ?? new Date(),
        };
    }

    private mapMessage(message: MessageDocument): WebsocketMessage {
        return {
            id: message._id.toString(),
            content: message.content ?? null,
            type: message.type as any,
            conversation: { id: message.conversationId },
            sender: { id: message.senderId, name: '' },
            attachments: (message.attachments ?? []) as MessageAttachment[],
            createdAt: message.createdAt ?? new Date(),
        };
    }

    async findConversation(userId: string, otherUserId: string): Promise<WebsocketConversation | null> {
        const conversation = await this.conversationModel.findOne({
            $or: [
                { user1Id: userId, user2Id: otherUserId },
                { user1Id: otherUserId, user2Id: userId },
            ],
        });

        if (!conversation) {
            return null;
        }

        return this.mapConversation(conversation);
    }

    async findConversationById(conversationId: string): Promise<WebsocketConversation | null> {
        const conversation = await this.conversationModel.findById(conversationId).exec();

        if (!conversation) {
            return null;
        }

        return this.mapConversation(conversation);
    }

    async createConversation(userId: string, otherUserId: string): Promise<WebsocketConversation> {
        const conversation = new this.conversationModel({
            user1Id: userId,
            user2Id: otherUserId,
        });
        const saved = await conversation.save();

        return this.mapConversation(saved);
    }

    async findMessages(conversationId: string, skip: number, take: number): Promise<WebsocketMessage[]> {
        const messages = await this.messageModel
            .find({
                conversationId,
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(take)
            .exec();

        return messages.map((message) => this.mapMessage(message));
    }

    async createMessage(data: CreateMessageInput): Promise<WebsocketMessage> {
        const message = new this.messageModel({
            content: data.content ?? undefined,
            type: data.type,
            conversationId: data.conversation?.id,
            senderId: data.sender?.id,
            attachments: [],
        });

        return this.mapMessage(message);
    }

    async saveMessage(message: WebsocketMessage): Promise<WebsocketMessage> {
        let persistedMessage: MessageDocument;

        const existingMessage = message?.id
            ? await this.messageModel.findById(message.id).exec()
            : null;

        if (existingMessage) {
            existingMessage.attachments = message.attachments ?? existingMessage.attachments ?? [];
            persistedMessage = await existingMessage.save();
        } else {
            const newMessage = new this.messageModel({
                content: message.content ?? undefined,
                type: message.type,
                conversationId: message.conversation?.id,
                senderId: message.sender?.id,
                attachments: message.attachments ?? [],
            });
            persistedMessage = await newMessage.save();
        }

        return this.mapMessage(persistedMessage);
    }

    async createAttachments(data: CreateAttachmentInput[]): Promise<MessageAttachment[]> {
        return data as MessageAttachment[];
    }

    async findUserById(_userId: string) {
        return null;
    }
}
