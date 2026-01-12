import { forwardRef, Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { Gateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway],
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AuthModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
