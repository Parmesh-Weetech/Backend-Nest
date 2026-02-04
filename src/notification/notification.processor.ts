import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { TraceSpan } from 'src/common/decorators/trace.span.decorator';
// import { NotificationSseService } from './notificationSse.service';

@Processor('notifications', {
    concurrency: 10
})
export class NotificationProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Notification)
        private readonly repo: Repository<Notification>,
        // private readonly notificationSseService: NotificationSseService
    ) {
        super();
    }

    @TraceSpan()
    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

        try {
            const notification = await this.repo.findOne({ where: { id: notificationId }, relations: ['sender', 'conversation'] });
            if (!notification) return;

            /**
                * 🔐 IDEMPOTENCY GUARD (ATOMIC)
                * Only one worker can update sentAt from NULL → Date
            */

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

            // No rows updated → already processed or not found
            if (result.affected === 0) {
                return;
            }

            console.log(
                `Sending notification to ${notification.conversation}`,
            );

            // if (result.affected !== undefined && result.affected !== null && result.affected > 0) {
            //     this.notificationSseService.sendSuccess(
            //         notificationId, notification.message, notification.sender.id, notification.createdAt, notification.conversation.id, "SENT"
            //     );
            // }

            /**
             * 🔔 Side effects go here
             * - WebSocket emit
             * - Email
             * - Push notification
             */

        } catch (err) {
            /**
             * ⚠️ IMPORTANT
             * sentAt was already set → do NOT retry blindly
             * mark failed explicitly
             */
            const updateNotificationStatus = await this.repo.update(notificationId, {
                status: 'FAILED',
            });

            // if (updateNotificationStatus.affected !== undefined && updateNotificationStatus.affected !== null && updateNotificationStatus.affected > 0) {
            //     this.notificationSseService.sendError(
            //         notificationId, err, "FAILED"
            //     );
            // }

            throw err; // allow BullMQ retry if configured
        }
    }
}