import { InjectRepository } from '@nestjs/typeorm';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Repository } from 'typeorm';
import { Job } from 'bullmq';

import { Notification } from './entities/notification.entity';
import { NotificationSseService } from './notificationSse.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';

@Processor('notifications', {
    concurrency: 10
})
export class NotificationProcessor extends WorkerHost {
    constructor(
        @InjectRepository(NotificationRepository)
        private readonly notificationRepository: NotificationRepository,

        private readonly notificationSseService: NotificationSseService
    ) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

        try {
            const notification = await this.notificationRepository.findById(notificationId)
            if (!notification) throw new NotFoundException('Notification not found');

            const result = await this.notificationRepository.updateNotification(notificationId);

            if (result.affected === 0 || result.affected === undefined || result.affected === null) {
                throw new InternalServerErrorException({ message: "Something went wrong while updating status" });
            }

            console.log(
                `Sending notification to ${notification.conversation}`,
            );

            if (result.affected !== undefined && result.affected !== null && result.affected > 0) {
                this.notificationSseService.sendSuccess(
                    notificationId, notification.message, notification.sender.id, notification.createdAt, notification.conversation.id, "SENT"
                );
            }

        } catch (err) {
            await this.notificationRepository.update(notificationId, {
                status: 'FAILED',
            });

            this.notificationSseService.sendError(
                notificationId, err, "FAILED"
            );

            throw new InternalServerErrorException(err.message || 'Failed to send notification');
        }
    }
}
