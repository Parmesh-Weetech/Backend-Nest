import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Notification)
        private readonly repo: Repository<Notification>,
    ) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

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

        try {
            const notification = await this.repo.findOneBy({ id: notificationId });
            if (!notification) return;

            console.log(
                `Sending notification to ${notification.receiverId}`,
            );

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
            await this.repo.update(notificationId, {
                status: 'FAILED',
            });

            throw err; // allow BullMQ retry if configured
        }
    }
}
