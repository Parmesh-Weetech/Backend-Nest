import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { NotificationSseService } from './notificationSse.service';
import { NotificationSseController } from './notificationSse.controller';

@Module({
  providers: [NotificationService, CurrentUserInterceptor, NotificationSseService],
  controllers: [NotificationController, NotificationSseController],
  exports: [NotificationService, NotificationSseService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'notifications',
      connection: {
        url: "redis://localhost:6379"
      }
    }),
  ],
})
export class NotificationModule { }
