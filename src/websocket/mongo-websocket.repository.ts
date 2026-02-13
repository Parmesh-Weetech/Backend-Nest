import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IWebsocketRepository } from './websocket.repository.interface';
import { ConversationDocument } from './schemas/conversation.schema';
import { MessageDocument } from './schemas/message.schema';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class MongoWebsocketRepository implements IWebsocketRepository {
    constructor(
        @InjectModel(ConversationDocument.name)
        private readonly conversationModel: Model<ConversationDocument>,

        @InjectModel(MessageDocument.name)
        private readonly messageModel: Model<MessageDocument>,
    ) { }

    async findConversation(userId: string, otherUserId: string) {
        const conversation = await this.conversationModel
            .findOne({
                $or: [
                    { user1Id: userId, user2Id: otherUserId },
                    { user1Id: otherUserId, user2Id: userId },
                ],
            })
            .lean()
            .exec();

        if (!conversation) return null;

        return {
            id: conversation._id,
            user1: conversation.user1Id,
            user2: conversation.user2Id,
            createdAt: conversation.createdAt
        }
    }

    async findConversationById(conversationId: string) {
        return this.conversationModel.findOne({ id: conversationId });
    }

    async createConversation(userId: string, otherUserId: string) {
        return this.conversationModel.create({
            user1Id: userId,
            user2Id: otherUserId,
        });
    }

    async findMessages(conversationId: string, skip: number, take: number) {
        return this.messageModel
            .find({ conversationId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(take);
    }

    async createMessage(data: any) {
        return new this.messageModel(data);
    }

    async saveMessage(message: any) {
        return message.save();
    }

    async createAttachments() {
        return [];
    }

    async findUserById() {
        return null;
    }
}
