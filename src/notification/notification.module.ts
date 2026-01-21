import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Notification } from './entities/notification.entity';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([Notification]),

    // 🔴 THIS WAS MISSING
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
})
export class NotificationModule { }
