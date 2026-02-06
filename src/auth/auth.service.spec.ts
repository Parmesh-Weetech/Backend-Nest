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

  beforeAll(async () => {
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

  it('should create a user', async () => {
    const result = await service.signup({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.data.id).toBeDefined();
  });
});
