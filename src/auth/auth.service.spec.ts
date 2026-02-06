import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';

import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { testDataSource } from '../../test/helper/test-datasource';
import { MainSeeder } from '../../db/seeders/main.seed'
import { DataSource } from 'typeorm';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

describe('AuthService (real DB)', () => {
  let module: TestingModule;
  let service: AuthService;
  let testEmail: string;
  let testPassword = 'password123';
  let refreshToken: string;

  beforeAll(async () => {
    testEmail = `test_${process.pid}_${Date.now()}@test.com`;

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
        AuthModule,
      ],
    }).compile();

    const dataSource = module.get(DataSource);

    console.log('🌱 Running database seeders...');
    await new MainSeeder().run(dataSource);
    console.log('✅ Database seeding completed');
    service = module.get(AuthService);
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
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const result = await service.signup({
        name: 'Test User',
        email: testEmail,
        password: testPassword,
      });

      expect(result.data.id).toBeDefined();
    });

    it('should fail if email already exists', async () => {
      await expect(
        service.signup({
          name: 'Test User',
          email: testEmail,
          password: testPassword,
        }),
      ).rejects.toThrow();
    });
  })

  describe('login', () => {
    it('should sign in a user', async () => {
      const result = await service.login({
        email: testEmail,
        password: testPassword,
        organizationId: null,
        hcaptchaToken: "10000000-aaaa-bbbb-cccc-000000000001",
      });

      refreshToken = `Bearer ${result.refresh_token!}`;
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      await expect(
        service.login({
          email: testEmail,
          password: 'wrong-password',
          organizationId: null,
          hcaptchaToken: '10000000-aaaa-bbbb-cccc-000000000001',
        }),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const result = await service.logout(refreshToken);

      expect(result.success).toBe(true);
    });

    it('should fail logout with invalid token', async () => {
      await expect(
        service.logout('Bearer invalid.token.value'),
      ).rejects.toThrow();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const loginResult = await service.login({
        email: testEmail,
        password: testPassword,
        organizationId: null,
        hcaptchaToken: "10000000-aaaa-bbbb-cccc-000000000001",
      });

      const validRefreshToken = `Bearer ${loginResult.refresh_token!}`;

      const result = await service.refreshAccessToken(validRefreshToken);

      expect(result.data.access_token).toBeDefined();
      expect(result.data.refresh_token).toBeDefined();
    });

    it('should fail with invalid refresh token', async () => {
      await expect(
        service.refreshAccessToken('Bearer invalid.token.value'),
      ).rejects.toThrow();
    });
  });
});
