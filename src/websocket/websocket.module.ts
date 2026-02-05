import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Gateway } from './gateway';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { FilesModule } from '../files/files.module';
import { CacheModule } from '../cache/cache.module';
import { VideoModule } from '../video/video.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway],
  imports: [TypeOrmModule.forFeature([Conversation, Message, User, MessageAttachment]), AuthModule, UserModule, FilesModule, CacheModule, VideoModule, NotificationModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
