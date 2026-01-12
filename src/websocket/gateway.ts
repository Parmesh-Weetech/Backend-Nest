import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { WebsocketService } from './websocket.service';
import { Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { WsAuthGuard } from './guards/websocket.guard';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  constructor(
    private readonly webSocketService: WebsocketService
  ) { }

  @WebSocketServer() server: Server;

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
    @MessageBody() data: { anotherUserId: string },
    @ConnectedSocket() client: Socket,
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = client.data.user.id;

    const conversation = await this.webSocketService.findOrCreateConversation(userId, data.anotherUserId);

    client.join(conversation.id);
    console.log(`Socket ${client.id} joined room ${conversation.id}`);

    client.emit('joined', { userId: userId, anotherUserId: data.anotherUserId, conversationId: conversation.id });
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = client.data.user.id;

    const newMessage = await this.webSocketService.sendMessage(data, userId);

    client.broadcast.to(data.conversationId).emit('receive_message', {
      content: newMessage.content,
      type: newMessage.type,
      conversationId: data.conversationId,
      senderId: userId,
      receiverId: data.receiverId,
      createdAt: newMessage.createdAt,
    });
  }

  @SubscribeMessage("get_history")
  async handleGetHistory(
    @MessageBody() data: { conversationId: string }, 
    @ConnectedSocket() client: Socket
  ) {
    console.log(`History request received from ${client.id} for conversation ${data.conversationId}`);

    const messages = await this.webSocketService.getMessages(data.conversationId);

    client.emit('history', messages);

    return { status: 'History fetched', messages: messages };
  }
}
