import { InjectRepository } from '@nestjs/typeorm';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Repository } from 'typeorm';
import { Job } from 'bullmq';

import { Notification } from './entities/notification.entity';
import { NotificationSseService } from './notificationSse.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Processor('notifications', {
    concurrency: 10
})
export class NotificationProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Notification)
        private readonly repo: Repository<Notification>,
        private readonly notificationSseService: NotificationSseService
    ) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

        try {
            const notification = await this.repo.findOne({ where: { id: notificationId }, relations: ['sender', 'conversation'] });
            if (!notification) throw new NotFoundException('Notification not found');
            
            const result = await this.repo
                .createQueryBuilder()
                .update(Notification)
                .set({
                    sentAt: () => 'NOW()',
                    status: 'SENT',
                })
                .where('id = :id', { id: notificationId })
                .andWhere('sentAt IS NULL')
                .execute();

            if (result.affected === 0) {
                return;
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
            const updateNotificationStatus = await this.repo.update(notificationId, {
                status: 'FAILED',
            });

            if (updateNotificationStatus.affected !== undefined && updateNotificationStatus.affected !== null && updateNotificationStatus.affected > 0) {
                this.notificationSseService.sendError(
                    notificationId, err, "FAILED"
                );
            }

            throw new InternalServerErrorException(err.message || 'Failed to send notification');
        }
    }
}
