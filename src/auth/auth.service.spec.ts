import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { Refresh_token } from '../user/entities/refresh_token.entity';

import { createTestDatabase, dropTestDatabase } from '../../test/helper/test-db-manager';
import { createTestDataSource } from '../../test/helper/test-datasource';
import { RoleModule } from '../role/role.module';
import { OrganizationModule } from '../organization/organization.module';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';
import { HCaptchaModule } from '../h-captcha/h-captcha.module';
import { CacheModule } from '../cache/cache.module';
import { PostModule } from '../post/post.module';

describe('AuthService (real DB)', () => {
  let module: TestingModule;
  let service: AuthService;
  let dataSource: DataSource;
  let databaseName: string;

  beforeAll(async () => {
    // 1️⃣ create unique DB for THIS test file
    const { dbName } = await createTestDatabase();
    // store for later cleanup
    databaseName = dbName;

    // 2️⃣ connect TypeORM to that DB
    dataSource = createTestDataSource(dbName);
    await dataSource.initialize();

    // 3️⃣ boot Nest with real repositories
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dataSource.options),
        TypeOrmModule.forFeature([User, Refresh_token]),
        UserModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        OrganizationModule,
        HCaptchaModule,
        CacheModule,
        PostModule,

      ],
    }).overrideProvider(DataSource)
      .useValue(dataSource).compile();

    service = module.get(AuthService);
  });

  afterAll(async () => {
    try {
      if (module) {
        await module.close();

      }
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
    } finally {
      await dropTestDatabase(databaseName);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 👉 real DB test example
  it('should create a user', async () => {
    const user = await service.signup({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    });

    expect(user.data.id).toBeDefined();
    expect(user.data.email).toBe('test@test.com');
  });
});
