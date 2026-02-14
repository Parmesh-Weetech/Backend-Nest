import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import {
    CreateNotificationInput,
    INotificationRepository,
    NotificationRecord,
} from './notification.repository.interface';

@Injectable()
export class PostgresNotificationRepository implements INotificationRepository {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }

    private mapNotification(notification: Notification): NotificationRecord {
        return {
            id: notification.id,
            sender: { id: notification.sender?.id ?? (notification as any).senderId },
            conversation: { id: notification.conversation?.id ?? (notification as any).conversationId },
            message: notification.message,
            status: notification.status,
            scheduledAt: notification.scheduledAt,
            timezone: notification.timezone,
            sentAt: notification.sentAt,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }

    async create(data: CreateNotificationInput): Promise<NotificationRecord> {
        const notification = this.notificationRepo.create({
            sender: { id: data.senderId },
            conversation: { id: data.conversationId },
            message: data.message,
            scheduledAt: data.scheduledAt,
            sentAt: null,
            status: 'PENDING',
            timezone: data.timezone,
        });

        const saved = await this.notificationRepo.save(notification);
        return this.mapNotification(saved);
    }

    async findById(notificationId: string): Promise<NotificationRecord | null> {
        const notification = await this.notificationRepo.findOne({
            where: { id: notificationId },
            relations: ['sender', 'conversation'],
        });

        if (!notification) {
            return null;
        }

        return this.mapNotification(notification);
    }

    async markAsSent(notificationId: string): Promise<boolean> {
        const result = await this.notificationRepo.update(
            { id: notificationId, sentAt: IsNull() },
            {
                status: 'SENT',
                sentAt: new Date(),
            },
        );

        return (result.affected ?? 0) > 0;
    }

    async markAsFailed(notificationId: string): Promise<boolean> {
        const result = await this.notificationRepo.update(
            { id: notificationId },
            {
                status: 'FAILED',
            },
        );

        return (result.affected ?? 0) > 0;
    }
}
