import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Client } from 'pg';
import { DataSource } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { testDataSource } from '../../test/helper/test-datasource';
import { MainSeeder } from '../../db/seeders/main.seed';

import { HcaptchaGuard } from '../common/guards/h-captcha.guard';
import { AuthGuard } from '../common/guards/auth.guard';

import { Role } from '../../src/role/entities/role.entity';
import { User } from '../../src/user/entities/user.entity';
import { Organization } from '../../src/organization/entities/organization.entity';
import { Refresh_token } from '../../src/user/entities/refresh_token.entity';
import { Permission } from '../../src/permission/entities/permission.entity';
import { Files } from '../../src/files/entities/File.entity';
import { Video } from '../../src/video/entities/video.entity';
import { PostEntity } from '../../src/post/entities/post.entity';
import { Product } from '../../src/product/entities/product.entity';
import { Notification } from '../../src/notification/entities/notification.entity';
import { Message } from '../../src/websocket/entities/message.entity';
import { MessageAttachment } from '../../src/websocket/entities/MessageAttachment.entity';
import { Conversation } from '../../src/websocket/entities/conversation.entity';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let email: string;
  const password = 'password123';
  let refreshToken: string;
  let accessToken: string;

  beforeAll(async () => {
    email = `e2e_${Date.now()}@test.com`;

    // ---------- CREATE SCHEMA ----------
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

    // ---------- TEST MODULE ----------
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useFactory({
        factory: async () => {
          const ds = new DataSource({
            ...(testDataSource.options as any),
            schema
          });

          await ds.initialize();
          return ds;
        },
      })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(HcaptchaGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    // ---------- RUN SEEDERS ----------
    await new MainSeeder().run(dataSource);
  });

  // ---------- SIGNUP ----------
  it('POST /auth/signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'E2E User',
        email,
        password,
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.password).toBeUndefined();
  });

  // ---------- LOGIN ----------
  it('POST /auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
        organizationId: null,
        hcaptchaToken: '10000000-aaaa-bbbb-cccc-000000000001',
      })
      .expect(201);

    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.refresh_token).toBeDefined();

    accessToken = `Bearer ${res.body.data.access_token}`;
    refreshToken = `Bearer ${res.body.data.refresh_token}`;
  });

  // ---------- REFRESH ----------
  it('POST /auth/refresh-token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refreshToken })
      .expect(201);

    expect(res.body.data.access_token).toBeDefined();
    expect(res.body.data.refresh_token).toBeDefined();
  });

  // ---------- LOGOUT ----------
  it('POST /auth/logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', refreshToken)
      .expect(201);

    expect(res.body.success).toBe(true);
  });

  afterAll(async () => {
    await app.close();

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
});
