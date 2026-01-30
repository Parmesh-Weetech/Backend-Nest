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
import { VideoService } from '../video/video.service.js';
import { Video } from '../video/entities/video.entity.js';

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
        private readonly cacheService: CacheService,
        private readonly videoService: VideoService
    ) { }

    getMessageKey(conversationId: string, skip: number, take: number) {
        return `conversation:${conversationId}:messages:skip${skip}:take${take}`;
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

    async findMessages(conversationId: string, skip: number, take: number): Promise<Message[]> {
        // const messageKey = this.getMessageKey(conversationId, skip, take);
        // let cachedMessages = await this.cacheService.get<Message[]>(messageKey);

        // if (!cachedMessages) {
            
        //     await this.cacheService.set(messageKey, messages, 600);
        // }

        const messages = await this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'DESC' },
            relations: {
                sender: true,
                conversation: true,
                attachments: {
                    media: true,
                },
            },
            skip,
            take,
        });

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            (message as any).serialNumber = i + 1;

            if (!message.attachments?.length) continue;

            for (const attachment of message.attachments) {
                if (attachment.mediaType === "video") {
                    const video = await this.videoService.getVideoById(attachment.media.id);
                    attachment.url = video ? await this.videoService.getSignedUrl(video.path, video.originalVideoName) : '';
                } else {
                    const file = await this.fileService.getFileById(attachment.media.id);
                    attachment.url = file ? await this.fileService.getSignedUrl(file.id) : '';
                }
            }
        }

        // cachedMessages = messages;

        return messages
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
                let attachment: MessageAttachment

                if(media.mediaType === "video") {
                    const video = await this.videoService.getVideoById(media.id);

                    if (!video) {
                        throw new Error('Video not found');
                    }

                    const url = video ? await this.videoService.getSignedUrl(video.path, video.originalVideoName): "";

                    attachment = this.messageAttachmentRepository.create({
                        message: savedMessage,
                        mediaType: media.mediaType,
                        mimeType: video.mimeType,
                        media: video,
                        order: index,
                    });

                    attachment.url = url;
                } else {
                    const file = await this.fileService.getFileById(media.id);
                    
                    if (!file) {
                        throw new Error('File not found');
                    }

                    const url = file ? await this.fileService.getSignedUrl(media.id) : "";

                    attachment = this.messageAttachmentRepository.create({
                        message: savedMessage,
                        mediaType: media.mediaType,
                        mimeType: file.mimeType,
                        media: file,
                        order: index,
                    });

                    attachment.url = url;
                }

                attachmentEntities.push(attachment);
            }

            const savedAttachments =
                await this.messageAttachmentRepository.save(attachmentEntities);

            savedMessage.attachments = savedAttachments;
        }

        return savedMessage
    }
}
