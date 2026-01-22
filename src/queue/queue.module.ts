import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from '../notification/notification.service';
import { NotificationController } from '../notification/notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { NotificationProcessor } from '../notification/notification.processor';
import { Notification } from '../notification/entities/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        BullModule.registerQueue({ name: 'notifications' }),
        NotificationModule
    ],
    providers: [NotificationService, NotificationProcessor],
})
export class QueueModule {}
