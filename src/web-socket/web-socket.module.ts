import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service.js';
import { WebSocketController } from './web-socket.controller.js';
import { MyGateway } from './single.gateway.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity.js';
import { Message } from './entities/message.entity.js';
import { RoomGateWay } from './room.gateway.js';
import { ChatMessage } from './entities/chatMessage.entity.js';
import { ChatRoom } from './entities/chatRoom.entity.js';
import { User } from '../user/entities/user.entity.js';

@Module({
  providers: [WebSocketService, MyGateway, RoomGateWay],
  controllers: [WebSocketController],
  imports: [TypeOrmModule.forFeature([Conversation, Message, ChatMessage, ChatRoom, User])]
})
export class WebSocketModule { }
