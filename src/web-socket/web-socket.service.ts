import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { SendChatMessageDto } from './dtos/sendChatMessage.dto'
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';

@Injectable()
export class WebSocketService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepository: Repository<ChatMessage>,
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

    async createChatRoom(dto: ChatRoom): Promise<ChatRoom> {
        const existingChatRoom = await this.chatRoomRepository.findOne({ where: { name: dto.name } });

        if (existingChatRoom) {
            return existingChatRoom;
        }

        const newChatRoom = this.chatRoomRepository.create({
            name: dto.name,
            members: dto.members,
        });

        return this.chatRoomRepository.save(newChatRoom);
    }

    async saveChatMessage(dto: SendChatMessageDto): Promise<Message> {
        const newChatMessage = await this.chatMessageRepository.create({
            content: dto.content,
            type: dto.type,
            room: { id: dto.roomId },
            sender: { id: dto.senderId },
        })

        return await this.messageRepository.save(newChatMessage);
    }
}
