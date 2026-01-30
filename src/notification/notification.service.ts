import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { DateTime } from "luxon";

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue('notifications')
        private readonly queue: Queue,

        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    async create(
        senderId: string,
        receiverId: string,
        message: string,
        date: string,
        time: string,
        timezone: string
    ) {
        // ✅ Convert user time → UTC
        const scheduledAtUtc = DateTime
            .fromISO(`${date}T${time}`, { zone: timezone })
            .toUTC();

        // ✅ Calculate delay for BullMQ
        const delay = scheduledAtUtc.diffNow().as('milliseconds');

        if (delay <= 0) {
            throw new Error('Scheduled time must be in the future');
        }

        const notification = await this.notificationRepository.save({
            senderId,
            receiverId,
            message,
            scheduledAt: scheduledAtUtc.toJSDate(),
            timezone: timezone,
            sentAt: null,
            status: 'PENDING',
        });

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
            notificationId: notification.id,
            status: 'PENDING',
        };
    }

    async findOne(user: User) {
        return await this.notificationRepository.find({ where: { receiverId: user.id }, order: { createdAt: "DESC"} });
    }
}
