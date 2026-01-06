import { Injectable, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from './web-socket.service.js';
import { SendChatMessageDto } from './dtos/sendChatMessage.dto.js';
import { ChatRoomDto } from './dtos/chatRoom.dto.js';
import { createSessionMiddleware } from '../common/middlewares/session.middleware.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://127.0.0.1/5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
})

export class RoomGateWay {
  @WebSocketServer() server: Server;

  constructor(private readonly webSockerService: WebSocketService, private readonly configService: ConfigService) { }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit() {
    console.log('WebSocket Gateway Initialized');

    const sessionMiddleware = createSessionMiddleware(this.configService);

    this.server.use((socket, next) => {
      sessionMiddleware(socket.request as any, {} as any, next as any);
    });
  }

  @SubscribeMessage('join_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatRoomDto) {

    const isUserExist = this.webSockerService.checkUserExists(payload.memberId);
    if (!isUserExist) {
      throw new Error(`User with id ${payload.memberId} does not exist.`);
    }

    const chatRoom = await this.webSockerService.createChatRoom(payload);

    client.join(chatRoom.id);
    console.log(`Socket ${client.id} joined room ${chatRoom.id}`);

    const messages = await this.webSockerService.getChatMessages(chatRoom.id);

    const data = {
      ...payload,
      id: chatRoom.id,
      messages: messages,
    }

    client.emit('room_created', data);
    client.to(chatRoom.id).emit('newUserJoined', { userId: payload.memberId });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: SendChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.webSockerService.saveChatMessage(data);
    console.log('Message saved:', message);

    client.to(data.roomId).emit('newMessage', message);
  }
}
