import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WebSocketService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}
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

    async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
        const newMessage = this.messageRepository.create({
            content: sendMessageDto.content,
            type: sendMessageDto.type,
            conversation: { id: sendMessageDto.conversationId },
            sender: { id: sendMessageDto.senderId },
            receiver: { id: sendMessageDto.receiverId },
        });

        return this.messageRepository.save(newMessage);
    }
}
