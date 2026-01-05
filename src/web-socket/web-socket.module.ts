import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service.js';
import { WebSocketController } from './web-socket.controller.js';
import { MyGateway } from './gateway.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity.js';
import { Message } from './entities/message.entity.js';

@Module({
  providers: [WebSocketService, MyGateway],
  controllers: [WebSocketController],
  imports: [TypeOrmModule.forFeature([Conversation, Message])]
})
export class WebSocketModule {}
