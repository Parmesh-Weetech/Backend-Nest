import { Injectable } from '@nestjs/common';
import {
    ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { WebSocketService } from './web-socket.service';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ['http://127.0.0.1:5500'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    }
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer() server: Server;

    constructor(
        private readonly webSocketService: WebSocketService,
    ) {}

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    afterInit() {
        console.log('WebSocket Gateway Initialized');
    }

    @SubscribeMessage('join_conversation')
    async handleJoinConversation(
        @MessageBody() data: { userId: string; anotherUserId: string },
        @ConnectedSocket() client: Socket
    ) {
        const conversation = await this.webSocketService.findOrCreateConversation(data.userId, data.anotherUserId);

        client.join(conversation.id);
        console.log(`Socket ${client.id} joined room ${conversation.id}`);

        // Optional: send back confirmation
        client.emit('joined', { userId: data.userId, anotherUserId: data.anotherUserId, conversationId: conversation.id });
    }

    @SubscribeMessage("send_message")
    async handleMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket) {
        const newMessage = await this.webSocketService.sendMessage(data);

        client.broadcast.to(data.conversationId).emit('receive_message', {
            content: newMessage.content,
            type: newMessage.type,
            conversationId: data.conversationId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            createdAt: newMessage.createdAt,
        });
    }

    @SubscribeMessage("get_history")
    async handleGetHistory(@MessageBody() data: { conversationId: string}, @ConnectedSocket() client: Socket) {
        console.log(`History request received from ${client.id} for conversation ${data.conversationId}`);

        const messages = await this.webSocketService.getMessages(data.conversationId);

        client.emit('history', messages);

        return { status: 'History fetched', messages: messages };
    }

}
