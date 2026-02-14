import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { Job } from 'bullmq';

import { NotificationSseService } from './notificationSse.service';
import { NOTIFICATION_REPOSITORY } from './notification.repository.interface';
import type { INotificationRepository } from './notification.repository.interface';

@Processor('notifications', {
    concurrency: 10
})
export class NotificationProcessor extends WorkerHost {
    constructor(
        @Inject(NOTIFICATION_REPOSITORY)
        private readonly repo: INotificationRepository,
        private readonly notificationSseService: NotificationSseService
    ) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

        try {
            const notification = await this.repo.findById(notificationId);
            if (!notification) throw new NotFoundException('Notification not found');

            const markedAsSent = await this.repo.markAsSent(notificationId);

            if (!markedAsSent) {
                return;
            }

            console.log(
                `Sending notification to ${notification.conversation}`,
            );

            this.notificationSseService.sendSuccess(
                notificationId, notification.message, notification.sender.id, notification.createdAt, notification.conversation.id, "SENT"
            );

        } catch (err) {
            const updateNotificationStatus = await this.repo.markAsFailed(notificationId);

            if (updateNotificationStatus) {
                this.notificationSseService.sendError(
                    notificationId, err, "FAILED"
                );
            }

            throw new InternalServerErrorException(err.message || 'Failed to send notification');
        }
    }
}
