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
import { MessageAttachment } from './entities/MessageAttachment.entity.js';
import { FilesModule } from '../files/files.module.js';
import { CacheModule } from '../cache/cache.module.js';
import { VideoModule } from '../video/video.module.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway],
  imports: [TypeOrmModule.forFeature([Conversation, Message, User, MessageAttachment]), AuthModule, UserModule, FilesModule, CacheModule, VideoModule, NotificationModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
