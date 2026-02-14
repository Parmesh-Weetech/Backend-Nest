import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { FilesService } from '../files/files.service';
import { VideoService } from '../video/video.service';
import { NotificationService } from '../notification/notification.service';

import { Message } from './entities/message.entity';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { getCurrentTimePlusSeconds, getTodayDate } from './util/notification.websocket.util';
import {
    type CreateAttachmentInput,
    type IWebsocketRepository,
    WEBSOCKET_REPOSITORY,
    type WebsocketMessage,
} from './websocket.repository.interface';

@Injectable()
export class WebsocketService {
    constructor(
        @Inject(WEBSOCKET_REPOSITORY)
        private readonly repo: IWebsocketRepository,
        private readonly fileService: FilesService,
        private readonly videoService: VideoService,
        private readonly notificationService: NotificationService
    ) { }

    getMessageKey(conversationId: string, skip: number, take: number) {
        return `conversation:${conversationId}:messages:skip${skip}:take${take}`;
    }

    async findOrCreateConversation(userId: string, otherUserId: string): Promise<APIResponse> {
        const conversation = await this.repo.findConversation(userId, otherUserId);

        if (conversation) {
            return {
                data: conversation,
                success: true,
                expired: false,
                message: "Conversation fetched successfully.",
                statusCode: 200
            };
        }

        const newConversation = await this.repo.createConversation(userId, otherUserId);

        if(!newConversation) {
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

        const messages = await this.repo.findMessages(conversationId, skip, take);

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            (message as any).serialNumber = i + 1;

            if (!message.attachments?.length) continue;

            for (const attachment of message.attachments) {
                if (attachment.mediaType !== "video") {
                    const file = await this.fileService.getFileById(attachment.media.id);
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
    ): Promise<WebsocketMessage> {
        const conversation = await this.repo.findConversationById(sendMessageDto.conversationId);

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const sender = await this.repo.findUserById(senderId);

        if (!sender) {
            throw new Error('Sender not found');
        }

        const message = await this.repo.createMessage({
            content: sendMessageDto.content ?? null,
            type: sendMessageDto.type,
            conversation,
            sender
        });

        const savedMessage = await this.repo.saveMessage(message);

        if (sendMessageDto.attachments?.length) {

            const attachmentEntities: CreateAttachmentInput[] = [];

            for (let index = 0; index < sendMessageDto.attachments.length; index++) {
                const media = sendMessageDto.attachments[index];
                let attachment: CreateAttachmentInput;

                if (media.mediaType === "video") {
                    const video = await this.videoService.getVideoById(media.media.id);

                    if (!video) {
                        throw new Error('Video not found');
                    }

                    attachment = {
                        message: savedMessage,
                        mediaType: media.mediaType,
                        mimeType: video.mimeType,
                        media: video,
                        order: index,
                    };
                } else {
                    const file = await this.fileService.getFileById(media.media.id);

                    if (!file) {
                        throw new Error('File not found');
                    }

                    const signedUrlResponse = file ? await this.fileService.getSignedUrl(media.media.id) : "";
                    const url = typeof signedUrlResponse === 'string' ? signedUrlResponse : signedUrlResponse.data;

                    attachment = {
                        message: savedMessage,
                        mediaType: media.mediaType,
                        mimeType: file.mimeType,
                        media: file,
                        order: index,
                    };

                    attachment.url = url;
                }

                attachmentEntities.push(attachment);
            }

            const savedAttachments = await this.repo.createAttachments(attachmentEntities);

            savedMessage.attachments = savedAttachments;
            await this.repo.saveMessage(savedMessage);
        }

        await this.notificationService.create(
            sender.id,
            conversation.id,
            `New Message from ${sender.name}`,
            getTodayDate(),
            getCurrentTimePlusSeconds(120),
            'UTC'
        )

        return savedMessage
    }
}
