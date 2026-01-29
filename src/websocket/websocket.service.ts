import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity.js';
import { Conversation } from './entities/conversation.entity.js';
import { In, Repository } from 'typeorm';
import { SendMessageDto } from './dtos/sendMessage.dto.js';
import { User } from '../user/entities/user.entity.js';
import { MessageAttachment } from './entities/MessageAttachment.entity.js';
import { FilesService } from '../files/files.service.js';
import { CacheService } from '../cache/cache.service.js';

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
        private readonly messageAttachmentRepository: Repository<MessageAttachment>,
        private readonly fileService: FilesService,
        private readonly cacheService: CacheService
    ) { }

    private getMessageKey(conversationId: string) {
        return `messages:${conversationId}`;
    }

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
        const messageKey = this.getMessageKey(conversationId)
        let cachedMessages = await this.cacheService.get<Message[]>(messageKey);

        if(!cachedMessages) {
            const messages = await this.messageRepository.find({
                where: { conversation: { id: conversationId } },
                order: { createdAt: 'ASC' },
                relations: {
                    sender: true,
                    conversation: true,
                    attachments: {
                        media: true,
                    },
                },
            });

            for (const message of messages) {
                if (!message.attachments?.length) continue;

                for (const attachment of message.attachments) {
                    const file = await this.fileService.getFileById(
                        attachment.media.id
                    );

                    if (!file) {
                        attachment.url = "";
                    } else {
                        attachment.url = await this.fileService.getSignedUrl(
                            attachment.media.id
                        );
                    }
                }
            }

            cachedMessages = messages;
            await this.cacheService.set(this.getMessageKey(conversationId), messages, 600);
        }

        return cachedMessages;
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

            const attachmentEntities: MessageAttachment[] = [];

            for (let index = 0; index < sendMessageDto.attachments.length; index++) {
                const media = sendMessageDto.attachments[index];

                const file = await this.fileService.getFileById(media.id);

                if (!file) {
                    throw new Error('File not found');
                }

                const url = await this.fileService.getSignedUrl(media.id);

                const attachment = this.messageAttachmentRepository.create({
                    message: savedMessage,
                    mediaType: media.mediaType,
                    mimeType: file.mimeType,
                    media: file,
                    order: index,
                });

                attachment.url = url;

                attachmentEntities.push(attachment);
            }

            const savedAttachments =
                await this.messageAttachmentRepository.save(attachmentEntities);

            savedMessage.attachments = savedAttachments;
        }

        return savedMessage
    }

    async findAttachmentsWithUrls(messages: Message[]): Promise<MessageAttachment[]> {
        if (!messages.length) return [];

        const messageIds = messages.map(m => m.id);

        // Fetch attachments with relations
        const attachments = await this.messageAttachmentRepository.find({
            where: {
                message: {
                    id: In(messageIds),
                },
            },
            relations: {
                media: true,
                message: {
                    sender: true,
                },
            },
        });

        // Add URLs to attachments
        for (const attachment of attachments) {
            const file = attachment.media;
            const existsFile = await this.fileService.getFileById(file.id);

            if (!existsFile) {
                attachment.url = ""; // set url to empty string
            } else {
                attachment.url = await this.fileService.getSignedUrl(file.id); // set url to signed URL
            }
        }

        return attachments;
    }
}
