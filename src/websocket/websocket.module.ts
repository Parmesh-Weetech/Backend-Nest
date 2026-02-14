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
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationDocument, ConversationSchema } from './schemas/conversation.schema';
import { MessageDocument, MessageSchema } from './schemas/message.schema';
import { WEBSOCKET_REPOSITORY } from './websocket.repository.interface';
import { PostgresWebsocketRepository } from './postgres-websocket.repository';
import { MongoWebsocketRepository } from './mongo-websocket.repository';

const databaseProvider = process.env.DATABASE_PROVIDER?.toLowerCase();
const isPostgres = databaseProvider === 'postgres';
const isMongo = databaseProvider === 'mongo' || databaseProvider === 'mongodb';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, Gateway, {
    provide: WEBSOCKET_REPOSITORY,
    useClass:
      isPostgres
        ? PostgresWebsocketRepository
        : MongoWebsocketRepository,
  }],
  imports: [...(isPostgres
    ? [TypeOrmModule.forFeature([Conversation, Message, MessageAttachment, User])]
    : []),

  ...(isMongo
    ? [
      MongooseModule.forFeature([
        { name: ConversationDocument.name, schema: ConversationSchema },
        { name: MessageDocument.name, schema: MessageSchema },
      ]),
    ]
    : []), AuthModule, UserModule, FilesModule, CacheModule, VideoModule, NotificationModule],
  exports: [WebsocketService]
})
export class WebsocketModule { }
