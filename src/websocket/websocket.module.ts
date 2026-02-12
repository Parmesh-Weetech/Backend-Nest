import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Gateway } from './gateway';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { FilesModule } from '../files/files.module';
import { CacheModule } from '../cache/cache.module';
import { VideoModule } from '../video/video.module';
import { NotificationModule } from '../notification/notification.module';
import { ConversationRepository, MessageRepository } from './websocket.repository';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway, ConversationRepository, MessageRepository],
  imports: [TypeOrmModule.forFeature([ConversationRepository, MessageRepository, MessageAttachment]), AuthModule, UserModule, FilesModule, CacheModule, VideoModule, NotificationModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
