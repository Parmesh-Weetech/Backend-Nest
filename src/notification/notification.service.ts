import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';

import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { DateTime } from "luxon";

import { Notification } from './entities/notification.entity';
import { APIResponse } from 'src/common/response/response.dto';

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

        const notificationObject = this.notificationRepository.create({
            sender: { id: senderId },
            conversation: { id: conversationId },
            message: message,
            scheduledAt: scheduledAtUtc.toJSDate(),
            sentAt: null,
            status: "PENDING",
            timezone: timezone,
        })

        const notification = await this.notificationRepository.save(notificationObject);

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

    async fetchNotificationById(notificationId: string): Promise<APIResponse> {
        const notification = await this.notificationRepository.findOne({ where: { id: notificationId }, relations: ['sender', 'conversation'] });

        if (!notification) return {
            success: false,
            data: null,
            expired: false,
            message: "Notification Not Found",
            statusCode: 404
        }

        return {
            success: true,
            data: notification,
            expired: false,
            message: "Notification found successfully",
            statusCode: 200
        }
    }

    async updateNotificationById(notificationId: string, status: "SENT" | "FAILED" | "PENDING"): Promise<APIResponse> {
        const result = await this.notificationRepository.createQueryBuilder()
            .update(Notification)
            .set({
                sentAt: () => 'NOW()',
                status: status,
            })
            .where('id = :id', { id: notificationId })
            .andWhere('sentAt IS NULL')
            .execute();

        if (result.affected === 0) {
            return {
                success: false,
                data: null,
                expired: false,
                message: "Internal Server Error while updating notification",
                statusCode: 500
            }
        }

        return {
            success: true,
            data: null,
            expired: false,
            message: "Notification updated successfully",
            statusCode: 200
        };
    }
}
