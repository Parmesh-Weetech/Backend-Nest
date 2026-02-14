import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    CreateNotificationInput,
    INotificationRepository,
    NotificationRecord,
} from './notification.repository.interface';
import { NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class MongoNotificationRepository implements INotificationRepository {
    constructor(
        @InjectModel(NotificationDocument.name)
        private readonly notificationModel: Model<NotificationDocument>,
    ) { }

    private mapNotification(notification: any): NotificationRecord {
        return {
            id: notification._id?.toString?.() ?? String(notification.id),
            sender: { id: notification.senderId },
            conversation: { id: notification.conversationId },
            message: notification.message,
            status: notification.status,
            scheduledAt: notification.scheduledAt,
            timezone: notification.timezone,
            sentAt: notification.sentAt ?? null,
            createdAt: notification.createdAt ?? new Date(),
            updatedAt: notification.updatedAt ?? new Date(),
        };
    }

    async create(data: CreateNotificationInput): Promise<NotificationRecord> {
        const notification = new this.notificationModel({
            senderId: data.senderId,
            conversationId: data.conversationId,
            message: data.message,
            status: 'PENDING',
            scheduledAt: data.scheduledAt,
            timezone: data.timezone,
            sentAt: null,
        });
        const saved = await notification.save();

        return this.mapNotification(saved);
    }

    async findById(notificationId: string): Promise<NotificationRecord | null> {
        const notification = await this.notificationModel.findById(notificationId).lean().exec();

        if (!notification) {
            return null;
        }

        return this.mapNotification(notification);
    }

    async markAsSent(notificationId: string): Promise<boolean> {
        const updated = await this.notificationModel
            .findOneAndUpdate(
                { _id: notificationId, sentAt: null },
                { $set: { status: 'SENT', sentAt: new Date() } },
                { new: true },
            )
            .exec();

        return !!updated;
    }

    async markAsFailed(notificationId: string): Promise<boolean> {
        const updated = await this.notificationModel
            .findByIdAndUpdate(
                notificationId,
                { $set: { status: 'FAILED' } },
                { new: true },
            )
            .exec();

        return !!updated;
    }
}
