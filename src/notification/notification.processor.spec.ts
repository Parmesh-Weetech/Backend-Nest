import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import { Queue } from 'bullmq';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { DataSource } from 'typeorm';

import { testDataSource } from '../../test/helper/test-datasource';
import { Notification } from './entities/notification.entity';
import { NotificationProcessor } from './notification.processor';
import { NotificationSseService } from './notificationSse.service';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';
import { User } from '../user/entities/user.entity';
import { WebsocketService } from '../websocket/websocket.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { MainSeeder } from '../../db/seeders/main.seed';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

describe('NotificationProcessor (real DB + real Redis)', () => {
    let module: TestingModule;
    let dataSource: DataSource;
    let queue: Queue;
    let notificationService: NotificationService;
    let websocketService: WebsocketService;
    let senderId: string;
    let conversationId: string;
    let notificationId: string;

    beforeAll(async () => {
        // 1️⃣ Create schema
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

        // 2️⃣ Create testing module
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    ...(testDataSource.options as any),
                    schema,
                }),
                TypeOrmModule.forFeature([Notification]),

                // 🔥 THIS WAS MISSING
                BullModule.forRoot({
                    connection: {
                        host: 'localhost',
                        port: 6379,
                    },
                    prefix: `test_${workerId}`, // redis namespace
                }),
                BullModule.registerQueue({
                    name: 'notifications',
                }),

                NotificationModule,
                WebsocketModule
            ],
            providers: [
                NotificationProcessor,
                NotificationSseService,
            ],
        }).compile();


        dataSource = module.get(DataSource);
        queue = module.get<Queue>(getQueueToken('notifications'));
        notificationService = module.get(NotificationService);
        websocketService = module.get(WebsocketService);

        // 3️⃣ Seed base data
        await new MainSeeder().run(dataSource);
    });

    afterAll(async () => {
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

        const sender = await dataSource.getRepository(User).save({
            name: 'Sender User',
            email: `sender_${Date.now()}@example.com`,
            password: 'password',
        });

        senderId = sender.id;

        // Create conversation
        const conversation = await websocketService.findOrCreateConversation(senderId, senderId);
        conversationId = conversation.data.id;

        // 3️⃣ Insert notification directly into DB
        const result = await notificationService.create(
            senderId,
            conversationId,
            'Hello, this is a test notification!',
            '2026-02-06',
            '16:15',
            'Asia/Kolkata'
        );

        notificationId = result.data.notificationId;

        // 4️⃣ Push job to BullMQ
        await queue.add(
            'send-notification',
            { notificationId },
            { removeOnComplete: true }
        );

        // 5️⃣ Wait for worker to process job
        await new Promise(resolve => setTimeout(resolve, 5000));

        let repo = dataSource.getRepository(Notification);
        // 6️⃣ Fetch updated notification
        const updated = await repo.findOne({
            where: { id: notificationId },
        });

        expect(updated).toBeDefined();
        expect(updated!.status).toBe('SENT');
        expect(updated!.sentAt).toBeInstanceOf(Date);
    });
});
