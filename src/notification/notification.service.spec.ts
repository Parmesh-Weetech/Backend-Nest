import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { testDataSource } from '../../test/helper/test-datasource';
import { MainSeeder } from '../../db/seeders/main.seed';

import { NotificationService } from './notification.service';
import { NotificationModule } from './notification.module';
import { User } from '../user/entities/user.entity';
import { WebsocketService } from '../../src/websocket/websocket.service';
import { WebsocketModule } from '../../src/websocket/websocket.module';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;
const redisPrefix = `test_${workerId}`;

describe('NotificationService (real DB + real Redis)', () => {
  let module: TestingModule;
  let notificationService: NotificationService;
  let dataSource: DataSource;
  let websocketService: WebsocketService;

  let senderId: string;
  let conversationId: string;

  beforeAll(async () => {
    /** Create isolated DB schema */
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

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...(testDataSource.options as any),
          schema,
        } as any),

        /** Redis namespace (mentor-approved) */
        CacheModule.register({
          prefix: `${redisPrefix}:cache:`,
        }),

        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
          },
          prefix: `${redisPrefix}:bull`,
        }),

        NotificationModule,
        WebsocketModule
      ],
    }).compile();

    dataSource = module.get(DataSource);
    notificationService = module.get(NotificationService);
    websocketService = module.get(WebsocketService);

    /** Seed base data */
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

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {

      // Create sender user
      const sender = await dataSource.getRepository(User).save({
        name: 'Sender User',
        email: `sender_${Date.now()}@example.com`,
        password: 'password',
      });

      senderId = sender.id;

      // Create conversation
      const conversation = await websocketService.findOrCreateConversation(senderId, senderId);
      conversationId = conversation.data.id;

      // Send notification
      const result = await notificationService.create(
        senderId,
        conversationId,
        'Hello, this is a test notification!',
        '2099-02-09',     // YYYY-MM-DD
        '09:10',          // 24-hour, no PM
        'Asia/Kolkata',   // valid IANA timezone
      );


      expect(result.data).toBeDefined();
      expect(result.data.notificationId).toBeDefined();
    });
  });

});
