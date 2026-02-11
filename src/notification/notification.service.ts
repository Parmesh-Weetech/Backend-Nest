import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';
import { DateTime } from "luxon";

import { APIResponse } from 'src/common/response/response.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue('notifications')
        private readonly queue: Queue,

        @InjectRepository(NotificationRepository)
        private readonly notificationRepository: NotificationRepository
    ) { }

    async create(
        senderId: string,
        conversationId: string,
        message: string,
        date: string,
        time: string,
        timezone: string
    ): Promise<APIResponse> {
        const scheduledAtUtc = DateTime
            .fromISO(`${date}T${time}`, { zone: timezone })
            .toUTC();

        const delay = scheduledAtUtc.diffNow().as('milliseconds');
        if (delay <= 0) throw new BadRequestException('Scheduled time must be in the future');

        const notification = await this.notificationRepository.createNotification(
            senderId,
            conversationId,
            message,
            scheduledAtUtc.toJSDate(),
            null,
            "PENDING",
            timezone,
        )

        if (!notification) throw new InternalServerErrorException('Failed to create notification');

        await this.queue.add(
            'send-notification',
            { notificationId: notification.id },
            {
                delay: delay,
                attempts: 5,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: {
                    age: 60 * 60,
                    count: 10
                },
                removeOnFail: {
                    age: 24 * 60 * 60,
                    count: 1000
                },
            },
        );

        return {
            data: {
                notificationId: notification.id,
                status: 'PENDING'
            },
            success: true,
            expired: false,
            statusCode: 201,
            message: "Notification Created Successfully."
        };
    }
}
