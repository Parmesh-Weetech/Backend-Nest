import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WebSocketService } from './web-socket.service.js';
import { SendMessageDto } from './dtos/sendMessage.dto.js';
import { Message } from './entities/message.entity.js';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})
export class MyGateway {
    constructor(private readonly webSocketService: WebSocketService) { }
    private message: Message;
    
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() data: { userId: string, otherUserId: string }, @ConnectedSocket() client: Socket) {
        const conversation = await this.webSocketService.findOrCreateConversation(data.userId, data.otherUserId);

        client.join(conversation.id);
        client.emit('joinRoom', { roomId: conversation.id, Message: `User ${data.userId} joined room.` });

        return `User ${data.userId} joined room ${conversation.id}`;
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() data: { userId: string, conversationId: string }, @ConnectedSocket() client: Socket) {
        client.leave(data.conversationId);
        client.emit('leaveRoom', { roomId: data.conversationId, Message: `User ${data.userId} left room.` });

        return `User ${data.userId} left room ${data.conversationId}`;
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket) {
        this.message = await this.webSocketService.sendMessage(data);
        console.log(this.message)

        client.nsp.to(data.conversationId).emit('getMessage', {
            message: this.message,
            senderId: data.senderId,
            conversationId: data.conversationId
        });

        return `Message sent to room ${data.conversationId}`;
    }

    @SubscribeMessage('getMessage')
    async handleGetMessages(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
        const messages = await this.webSocketService.getMessage(data.conversationId, this.message.id);

        client.emit('getMessage', { conversationId: data.conversationId, messages: messages });

        return `Messages sent for room ${data.conversationId}`;
    }
}
