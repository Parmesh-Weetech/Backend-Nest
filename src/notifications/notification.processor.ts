import { Processor, WorkerHost } from "@nestjs/bullmq";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Job } from "bullmq";

@Processor('notifications', {
    concurrency: 10
})
export class NotificationProcessor extends WorkerHost {

    constructor(private readonly configService: ConfigService) {
        super();
    }

    async process(job: Job<{ notificationId: string }>) {
        const { notificationId } = job.data;

        const MAIN_SERVER_URL = this.configService.get<string>("MAIN_SERVER_URL");
        const secret = this.configService.get<string>("SECRET");

        try {
            const notification = await axios.get(
                `${MAIN_SERVER_URL}/notification/${notificationId}`,
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            );

            if (!notification.data) throw new NotFoundException('Notification not found');

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
