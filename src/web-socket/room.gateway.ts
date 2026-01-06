import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoom } from './entities/chatRoom.entity.js';
import { WebSocketService } from './web-socket.service.js';
import { SendChatMessageDto } from './dtos/sendChatMessage.dto.js';

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

  constructor(private readonly webSockerService: WebSocketService) {}

  @SubscribeMessage('join_room')
  async handleCreateRoom(client: Socket, payload: ChatRoom) {
    const chatRoom = await this.webSockerService.createChatRoom(payload);

    client.join(chatRoom.id);
    console.log(`Socket ${client.id} joined room ${chatRoom.id}`);

    const data = {
      ...payload,
      id: chatRoom.id
    }

    client.emit('room_created', data);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: SendChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.webSockerService.saveChatMessage(data);

    // emit to everyone in room
    this.server.to(data.roomId).emit('newMessage', message);
  }
}
