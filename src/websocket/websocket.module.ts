import { forwardRef, Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller.js';
import { WebsocketService } from './websocket.service.js';
import { Gateway } from './gateway.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity.js';
import { Message } from './entities/message.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway],
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AuthModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
