import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationSseService } from './notificationSse.service';
import { NotificationController } from './notification.controller';
import { NotificationSseController } from './notificationSse.controller';
import { NotificationRepository } from './notification.repository';

@Module({
  providers: [NotificationService, NotificationSseService, CurrentUserInterceptor, NotificationRepository],
  controllers: [NotificationController, NotificationSseController],
  exports: [NotificationService, NotificationSseService],
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([NotificationRepository]),
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        url: "redis://localhost:6379"
      }
    }),
  ],
})
export class NotificationModule { }
