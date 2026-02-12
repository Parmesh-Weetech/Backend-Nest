import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Gateway } from './gateway';
import { FilesModule } from '../files/files.module';
import { CacheModule } from '../cache/cache.module';
import { VideoModule } from '../video/video.module';
import { NotificationModule } from '../notification/notification.module';
import { ConversationRepository, MessageAttachmentRepository, MessageRepository } from './websocket.repository';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway, ConversationRepository, MessageRepository, MessageAttachmentRepository],
  imports: [TypeOrmModule.forFeature([ConversationRepository, MessageRepository, MessageAttachmentRepository]), AuthModule, UserModule, FilesModule, CacheModule, VideoModule, NotificationModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
