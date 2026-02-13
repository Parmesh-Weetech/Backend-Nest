import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IWebsocketRepository } from './websocket.repository.interface';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostgresWebsocketRepository implements IWebsocketRepository {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepo: Repository<Conversation>,

        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,

        @InjectRepository(MessageAttachment)
        private readonly attachmentRepo: Repository<MessageAttachment>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async findConversation(userId: string, otherUserId: string) {
        return this.conversationRepo
            .createQueryBuilder('conversation')
            .where(
                '(conversation.user1Id = :userId AND conversation.user2Id = :otherUserId) OR (conversation.user1Id = :otherUserId AND conversation.user2Id = :userId)',
                { userId, otherUserId },
            )
            .getOne();
    }

    async findConversationById(conversationId: string) {
        return this.conversationRepo.findOne({ where: { id: conversationId } });
    }

    async createConversation(userId: string, otherUserId: string) {
        const conversation = this.conversationRepo.create({
            user1: { id: userId },
            user2: { id: otherUserId },
        });

        return this.conversationRepo.save(conversation);
    }

    async findMessages(conversationId: string, skip: number, take: number) {
        return this.messageRepo.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'DESC' },
            relations: {
                sender: true,
                conversation: true,
                attachments: { media: true },
            },
            skip,
            take,
        });
    }

    async createMessage(data: Partial<Message>) {
        return this.messageRepo.create(data);
    }

    async saveMessage(message: Partial<Message>) {
        return this.messageRepo.save(message);
    }

    async createAttachments(data: Partial<MessageAttachment>[]) {
        return this.attachmentRepo.save(data);
    }

    async findUserById(userId: string) {
        return this.userRepo.findOne({ where: { id: userId } });
    }
}
