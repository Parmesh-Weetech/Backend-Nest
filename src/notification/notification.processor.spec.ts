import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { delay, Queue, QueueEvents } from 'bullmq';
import { Client } from 'pg';
import { DataSource } from 'typeorm';

import { testDataSource } from '../../test/helper/test-datasource';
import { Notification } from './entities/notification.entity';
import { NotificationProcessor } from './notification.processor';
import { NotificationSseService } from './notificationSse.service';
import { NotificationModule } from './notification.module';
import { User } from '../user/entities/user.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { WebsocketService } from '../websocket/websocket.service';
import { MainSeeder } from '../../db/seeders/main.seed';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;
const redisPrefix = `test_${workerId}`;

describe('NotificationProcessor (real DB + real Redis)', () => {
    let module: TestingModule;
    let dataSource: DataSource;
    let queue: Queue;
    let queueEvents: QueueEvents;
    let websocketService: WebsocketService;

    beforeEach(async () => {
        jest.setTimeout(120000);
    });

    beforeAll(async () => {
        /** 1️⃣ Create isolated DB schema */
        const client = new Client({
            host: 'localhost',
            port: 5441,
            user: 'div',
            password: 'divpassword',
            database: 'divdata',
        });

        await client.connect();
        await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
        await client.end();

        /** 2️⃣ Create testing module */
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    ...(testDataSource.options as any),
                    schema,
                }),
                TypeOrmModule.forFeature([Notification, User]),

                BullModule.forRoot({
                    connection: {
                        host: 'localhost',
                        port: 6379,
                    },
                    prefix: `${redisPrefix}:bull`,
                }),
                BullModule.registerQueue({
                    name: 'notifications',
                }),

                NotificationModule,
                WebsocketModule,
            ],
            providers: [
                NotificationProcessor,
                NotificationSseService,
            ],
        }).compile();

        dataSource = module.get(DataSource);
        websocketService = module.get(WebsocketService);
        queue = module.get<Queue>(getQueueToken('notifications'));

        queueEvents = new QueueEvents(queue.name, {
            connection: {
                host: 'localhost',
                port: 6379,
            },
        });

        /** 3️⃣ Seed base data */
        await new MainSeeder().run(dataSource);
    });

    afterAll(async () => {
        await queueEvents.close();
        await module.close();

        const client = new Client({
            host: 'localhost',
            port: 5441,
            user: 'div',
            password: 'divpassword',
            database: 'divdata',
        });

        await client.connect();
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await client.end();
    });

    it('should process notification job and mark it as SENT', async () => {
        /** Create sender */
        const sender = await dataSource.getRepository(User).save({
            name: 'Sender User',
            email: `sender_${Date.now()}@example.com`,
            password: 'password',
        });

        /** Create conversation */
        const conversation = await websocketService.findOrCreateConversation(
            sender.id,
            sender.id,
        );

        const scheduledAt = new Date(Date.now() + 60_000); // +1 min

        /** 1️⃣ Insert notification with VALID future time */
        const notification = await dataSource
            .getRepository(Notification)
            .save({
                senderId: sender.id,
                conversationId: conversation.data.id,
                message: 'Hello, this is a test notification!',
                status: 'PENDING',
                scheduledAt: scheduledAt,
                timezone: 'Asia/Kolkata'
            });

        /** 2️⃣ Make it due (simulate time passing) */
        await dataSource
            .getRepository(Notification)
            .update(notification.id, {
                scheduledAt: new Date(Date.now() - 1000),
            });

        const delay =
            scheduledAt.getTime() - Date.now();

        /** 3️⃣ Enqueue job */
        const job = await queue.add(
            'send-notification',
            { notificationId: notification.id, delay: Math.max(delay, 0) },
            { removeOnComplete: true }
        );

        /** 4️⃣ Wait until BullMQ finishes processing */
        await job.waitUntilFinished(queueEvents);

        /** 5️⃣ Assert DB state */
        const updated = await dataSource
            .getRepository(Notification)
            .findOneBy({ id: notification.id });

        expect(updated).toBeDefined();
        expect(updated!.status).toBe('SENT');
        expect(updated!.sentAt).toBeInstanceOf(Date);
    });
});
