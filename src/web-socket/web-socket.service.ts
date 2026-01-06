import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { SendChatMessageDto } from './dtos/sendChatMessage.dto'
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { User } from '../user/entities/user.entity';
import { ChatRoomDto } from './dtos/chatRoom.dto';

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
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

    async createChatRoom(dto: ChatRoomDto): Promise<ChatRoom> {
        const existingChatRoom = await this.chatRoomRepository.findOne({ where: { name: dto.name } });

        
        if (existingChatRoom) {
            return existingChatRoom;
        }

        const newChatRoom = await this.chatRoomRepository.create({
            name: dto.name,
            members: dto.memberId ? [{ id: dto.memberId }] : [],
        });

        return await this.chatRoomRepository.save(newChatRoom);
    }

    async saveChatMessage(dto: SendChatMessageDto): Promise<ChatMessage> {
        const newChatMessage = await this.chatMessageRepository.create({
            content: dto.content,
            type: dto.type,
            room: { id: dto.roomId },
            sender: { id: dto.senderId },
        })


        return await this.chatMessageRepository.save(newChatMessage);
    }

    async getChatMessages(roomId: string): Promise<ChatMessage[]> {
        const messages = await this.chatMessageRepository.find({
            where: { room: { id: roomId } },
            order: { createdAt: 'ASC' },
        });

        return messages;
    }

    async checkUserExists(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: {
            id: id
        }});
        return !!user;
    }
}
