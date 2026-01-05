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
            user1: { id: userId } as any,
            user2: { id: otherUserId } as any,
        });

        return this.conversationRepository.save(newConversation);
    }

    async sendMessage(dto: SendMessageDto) {
        const newMessage = await this.messageRepository.create({
            conversation: { id: dto.conversationId },
            sender: { id: dto.senderId },
            content: dto.content,
            type: dto.type
        });

        await this.messageRepository.save(newMessage);

        return newMessage;
    }

    async getMessage(conversationId: string, id: string): Promise<Message | null> {
        const message = this.messageRepository.findOne({
            where: { conversation: { id: conversationId }, id: id }
        });

        if(!message) throw new Error("Message not found.");

        return message;
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'ASC' },
        });

        return messages;
    }
}
