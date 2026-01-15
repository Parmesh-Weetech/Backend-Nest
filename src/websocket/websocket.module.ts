import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller.js';
import { WebsocketService } from './websocket.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity.js';
import { Message } from './entities/message.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../user/entities/user.entity.js';
import { UserModule } from '../user/user.module.js';
import { Gateway } from './gateway.js';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway],
  imports: [TypeOrmModule.forFeature([Conversation, Message, User]), AuthModule, UserModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
