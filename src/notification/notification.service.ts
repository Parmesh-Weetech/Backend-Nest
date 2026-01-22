import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';

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
    ) {
        const notification = await this.notificationRepository.save({
            senderId,
            receiverId,
            message,
            sentAt: null,
            status: 'PENDING',
        });

        await this.queue.add(
            'send-notification',
            { notificationId: notification.id },
            {
                attempts: 5,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: false,
                removeOnFail: false,
                
            },
        );

        return {
            notificationId: notification.id,
            status: 'PENDING',
        };
    }

    async findOne(user: User) {
        console.log(user)
        return await this.notificationRepository.find({ where: { receiverId: user.id }, order: { createdAt: "DESC"} });
    }
}
