import { Processor, WorkerHost } from "@nestjs/bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { Repository } from "typeorm";
import { Job } from "bullmq";

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
    constructor(
        @InjectRepository(Notification)
        private readonly repo: Repository<Notification>,
    ) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const notification = await this.repo.findOneBy({
            id: job.data.notificationId,
        });

        if (!notification) return;

        // 🔐 Idempotency
        if (notification.sentAt) return;

        try {
            console.log(
                `Sending notification to ${notification.receiverId}`,
            );

            await this.repo.update(notification.id, {
                sentAt: new Date(),
                status: 'SENT',
            });
        } catch (err) {
            await this.repo.update(notification.id, {
                status: 'FAILED',
            });
            throw err; // retry
        }
    }
}
