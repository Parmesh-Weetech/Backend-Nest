import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dtos/sendMessage.dto';
import type { Response } from 'express';

@Injectable()
export class WebsocketService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) { }
    async findOrCreateConversation(userId: string, otherUserId: string) {
        const conversation = await this.conversationRepository.findOne({ where: { user1: { id: userId }, user2: { id: otherUserId } } });

        if (conversation) {
            return conversation;
        }

        const newConversation = this.conversationRepository.create({
            user1: { id: userId },
            user2: { id: otherUserId },
        });

        return this.conversationRepository.save(newConversation);
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'ASC' },
        });

        return messages;
    }

    async sendMessage(sendMessageDto: SendMessageDto, senderId: string): Promise<Message> {
        const newMessage = this.messageRepository.create({
            content: sendMessageDto.content,
            type: sendMessageDto.type,
            conversation: { id: sendMessageDto.conversationId },
            sender: { id: senderId },
            receiver: { id: sendMessageDto.receiverId },
        });

        return this.messageRepository.save(newMessage);
    }
}
