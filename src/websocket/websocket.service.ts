import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APIResponse } from '../common/response/response.dto';
import { FilesService } from '../files/files.service';
import { VideoService } from '../video/video.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

import { Message } from './entities/message.entity';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { getCurrentTimePlusSeconds, getTodayDate } from './util/notification.websocket.util';
import { ConversationRepository, MessageAttachmentRepository, MessageRepository } from './websocket.repository';

@Injectable()
export class WebsocketService {
    constructor(
        @InjectRepository(ConversationRepository)
        private readonly conversationRepository: ConversationRepository,
        @InjectRepository(MessageRepository)
        private readonly messageRepository: MessageRepository,

        @InjectRepository(MessageAttachmentRepository)
        private readonly messageAttachmentRepository: MessageAttachmentRepository,

        private readonly fileService: FilesService,
        private readonly videoService: VideoService,
        private readonly notificationService: NotificationService,
        private readonly userService: UserService
    ) { }

    getMessageKey(conversationId: string, skip: number, take: number) {
        return `conversation:${conversationId}:messages:skip${skip}:take${take}`;
    }

    async findOrCreateConversation(userId: string, otherUserId: string): Promise<APIResponse> {
        const conversation = await this.conversationRepository.findConversation(userId, otherUserId);

        if (conversation) {
            return {
                data: conversation,
                success: true,
                expired: false,
                message: "Conversation fetched successfully.",
                statusCode: 200
            };
        }

        const newConversation = await this.conversationRepository.createConversation(userId, otherUserId);

        if (!newConversation) {
            throw new InternalServerErrorException('Failed to create conversation');
        }

        return {
            data: newConversation,
            success: true,
            expired: false,
            message: "Conversation created successfully.",
            statusCode: 201
        };
    }

    async findMessages(conversationId: string, skip: number, take: number): Promise<APIResponse> {
        // const messageKey = this.getMessageKey(conversationId, skip, take);
        // let cachedMessages = await this.cacheService.get<Message[]>(messageKey);

        // if (!cachedMessages) {

        //     await this.cacheService.set(messageKey, messages, 600);
        // }

        const messages = await this.messageRepository.findAll(conversationId, skip, take);
        if (!messages) throw new InternalServerErrorException({ message: "Something went wrong while fetching messages! please try again. " });

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            (message as any).serialNumber = i + 1;

            if (!message.attachments?.length) continue;

            for (const attachment of message.attachments) {
                if (attachment.mediaType !== "video") {
                    const file = await this.fileService.findFileById(attachment.media.id);
                    const signedUrlResponse = file ? await this.fileService.getSignedUrl(file.id) : '';
                    attachment.url = typeof signedUrlResponse === 'string' ? signedUrlResponse : signedUrlResponse.data;
                }
            }
        }

        // cachedMessages = messages;

        return {
            data: messages,
            success: true,
            expired: false,
            message: "Messages fetched successfully.",
            statusCode: 200
        }
    }

    async sendMessage(
        sendMessageDto: SendMessageDto,
        senderId: string
    ): Promise<Message> {
        const conversation = await this.conversationRepository.findById(sendMessageDto.conversationId);

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const sender = await this.userService.findOne(senderId);

        if (!sender) {
            throw new Error('Sender not found');
        }

        const savedMessage = await this.messageRepository.createMessage(sendMessageDto.type, conversation, sender.data, sendMessageDto.content);

        if (!savedMessage) throw new InternalServerErrorException({ message: "Internal Server Error while saving message " });

        if (sendMessageDto.attachments?.length) {

            const attachmentEntities: MessageAttachment[] = [];

            for (let index = 0; index < sendMessageDto.attachments.length; index++) {
                const media = sendMessageDto.attachments[index];
                let attachment: MessageAttachment | null

                if (media.mediaType === "video") {
                    const video = await this.videoService.findVideoById(media.media.id);

                    if (!video) {
                        throw new Error('Video not found');
                    }

                    attachment = await this.messageAttachmentRepository.createMessageAttachment(savedMessage, media.mediaType, video.mimeType, video, index);

                    if (!attachment) throw new InternalServerErrorException({ message: "Failed to create message attachment" });
                } else {
                    const file = await this.fileService.findFileById(media.media.id);

                    if (!file) {
                        throw new Error('File not found');
                    }

                    const signedUrlResponse = file ? await this.fileService.getSignedUrl(media.media.id) : "";
                    const url = typeof signedUrlResponse === 'string' ? signedUrlResponse : signedUrlResponse.data;

                    attachment = await this.messageAttachmentRepository.createMessageAttachment(savedMessage, media.mediaType, file.mimeType, file, index);

                    if (!attachment) throw new InternalServerErrorException({ message: "Failed to create message attachment" });

                    attachment.url = url;
                }

                attachmentEntities.push(attachment);
            }

            const savedAttachments =
                await this.messageAttachmentRepository.saveMessageAttachment(attachmentEntities);

            if (!savedAttachments) throw new InternalServerErrorException({ message: "Failed to save message attachments " });

            savedMessage.attachments = savedAttachments;
        }

        await this.notificationService.create(
            sender.data.id,
            conversation.id,
            `New Message from ${sender.data.name}`,
            getTodayDate(),
            getCurrentTimePlusSeconds(120),
            'UTC'
        )

        return savedMessage
    }
}
