import { Processor, WorkerHost } from "@nestjs/bullmq";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Job } from "bullmq";
import Redis from "ioredis";

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

            if (!notification.data.data) {
                throw new NotFoundException('Notification not found');
            }

            if (notification.data.data.status !== "PROCESSING") {
                throw new BadRequestException({ message: "Notification not created to process" });
            }

            const result = await axios.put(
                `${MAIN_SERVER_URL}/notification/${notificationId}`,
                {
                    data: {
                        message: notification.data.data.message,
                        status: "SENT",
                        senderId: notification.data.data.sender.id,
                        createdAt: notification.data.data.createdAt,
                        conversationId: notification.data.data.conversation.id
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )

            if (!result.data.success) {
                return;
            }

            console.log(
                `Sending notification to ${notification.data.data.conversation.id}`,
            );

        } catch (err) {
            console.log(err.message);

            await axios.put(
                `${MAIN_SERVER_URL}/notification/${notificationId}`,
                {
                    data: {
                        message: err.message,
                        status: "FAILED",
                    }
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )
        }
    }
}
