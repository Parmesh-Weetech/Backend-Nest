import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity.js';
import { Conversation } from './entities/conversation.entity.js';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dtos/sendMessage.dto.js';
import { User } from '../user/entities/user.entity.js';
import { MessageAttachment } from './entities/MessageAttachment.entity.js';

@Injectable()
export class WebsocketService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(MessageAttachment)
        private readonly messageAttachmentRepository: Repository<MessageAttachment>
    ) { }
    async findOrCreateConversation(userId: string, otherUserId: string) {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .where(
                '(conversation.user1Id = :userId AND conversation.user2Id = :otherUserId) OR (conversation.user1Id = :otherUserId AND conversation.user2Id = :userId)',
                { userId, otherUserId }
            )
            .getOne();


        if (conversation) {
            return conversation;
        }

        const newConversation = await this.conversationRepository.create({
            user1: { id: userId },
            user2: { id: otherUserId },
        });

        return await this.conversationRepository.save(newConversation);
    }

    async findMessages(conversationId: string): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'ASC' },
            relations: ['sender', 'conversation', 'receiver']
        });

        return messages;
    }

    async sendMessage(
        sendMessageDto: SendMessageDto,
        senderId: string
    ): Promise<Message> {
        const conversation = await this.conversationRepository.findOne({
            where: { id: sendMessageDto.conversationId },
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const sender = await this.userRepository.findOne({
            where: { id: senderId },
        });

        if (!sender) {
            throw new Error('Sender not found');
        }

        const message = this.messageRepository.create({
            content: sendMessageDto.content ?? null,
            type: sendMessageDto.type,
            conversation,
            sender,
        });

        const savedMessage = await this.messageRepository.save(message);

        if (sendMessageDto.attachments?.length) {

            const attachments = sendMessageDto.attachments.map((mediaId, index) =>
                this.messageAttachmentRepository.create({
                    message: savedMessage,
                    media: { id: mediaId } as any,
                    order: index,
                })
            );

            await this.messageAttachmentRepository.save(attachments);
        }

        return savedMessage;
    }

}
