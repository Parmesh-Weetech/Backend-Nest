import { Injectable } from "@nestjs/common";
import { DataSource, Repository, UpdateResult } from "typeorm";
import { Notification } from "./entities/notification.entity";

@Injectable()
export class NotificationRepository extends Repository<Notification> {

    constructor(private dataSource: DataSource) {
        super(Notification, dataSource.createEntityManager());
    }

    async createNotification(
        senderId: string,
        conversationId: string,
        message: string,
        scheduledAt: Date,
        sentAt: string | null,
        status: "PENDING" | "SENT" | "FAILED" = "PENDING",
        timezone: string
    ): Promise<Notification | null> {
        const newNotification = this.create({
            sender: { id: senderId },
            conversation: { id: conversationId },
            scheduledAt: scheduledAt,
            message: message,
            status: status,
            sentAt: sentAt,
            timezone: timezone
        });

        const saveNotification = await this.save(newNotification);

        if (!saveNotification) return null;

        return saveNotification;
    }

    async findById(id: string): Promise<Notification | null> {
        const notification = await this.findOne({ where: { id: id }, relations: ['sender', 'conversation'] });

        if (!notification) return null;

        return notification;
    }

    async updateNotification(id: string): Promise<UpdateResult> {
        const result = await this.createQueryBuilder()
            .update(Notification)
            .set({
                sentAt: () => 'NOW()',
                status: 'SENT',
            })
            .where('id = :id', { id: id })
            .andWhere('sentAt IS NULL')
            .execute();

        return result;
    }
}