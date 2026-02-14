export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export type NotificationRecord = {
    id: string;
    sender: { id: string };
    conversation: { id: string };
    message: string;
    status: NotificationStatus;
    scheduledAt: Date;
    timezone: string;
    sentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateNotificationInput = {
    senderId: string;
    conversationId: string;
    message: string;
    scheduledAt: Date;
    timezone: string;
};

export interface INotificationRepository {
    create(data: CreateNotificationInput): Promise<NotificationRecord>;
    findById(notificationId: string): Promise<NotificationRecord | null>;
    markAsSent(notificationId: string): Promise<boolean>;
    markAsFailed(notificationId: string): Promise<boolean>;
}
