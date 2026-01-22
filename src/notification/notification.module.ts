import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';

@Module({
  providers: [NotificationService, CurrentUserInterceptor],
  controllers: [NotificationController],
  exports: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
})
export class NotificationModule { }
