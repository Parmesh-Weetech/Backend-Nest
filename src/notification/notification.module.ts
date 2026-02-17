import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationSseService } from './notificationSse.service';
import { NotificationController } from './notification.controller';
import { NotificationSseController } from './notificationSse.controller';
import { NotificationDocument, NotificationSchema } from './schemas/notification.schema';
import { MongoNotificationRepository } from './mongo-notification.repository';
import { PostgresNotificationRepository } from './postgres-notification.repository';
import { NOTIFICATION_REPOSITORY } from './notification.repository.interface';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  providers: [
    NotificationService,
    NotificationSseService,
    CurrentUserInterceptor,
    PostgresNotificationRepository,
    MongoNotificationRepository,
    createDatabaseRepositoryProvider(
      NOTIFICATION_REPOSITORY,
      PostgresNotificationRepository,
      MongoNotificationRepository,
    ),
  ],
  controllers: [NotificationController, NotificationSseController],
  exports: [NotificationService, NotificationSseService, NOTIFICATION_REPOSITORY],
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Notification]),
    MongooseModule.forFeature([{ name: NotificationDocument.name, schema: NotificationSchema }]),
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        url: "redis://localhost:6379"
      }
    }),
  ],
})
export class NotificationModule { }
