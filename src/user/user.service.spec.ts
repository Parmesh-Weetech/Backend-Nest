import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';

import { testDataSource } from '../../test/helper/test-datasource';
import { MainSeeder } from '../../db/seeders/main.seed'
import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { Role } from '../role/entities/role.entity';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationModule } from '../organization/organization.module';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

describe('AuthService (real DB)', () => {
  let module: TestingModule;
  let service: UserService;
  let organizationService: OrganizationService;
  let name: string;
  let email: string;
  let password: string;
  let userId: string;
  let seededRoles: Role[];
  let adminRoleId: string;
  let organizationId :string;
  let userData: User;

  beforeAll(async () => {
    name = `Test_User_${process.pid}_${Date.now()}`;
    email = `test_${process.pid}_${Date.now()}@gmail.com`;
    password = `test_password_${process.pid}_${Date.now()}`;

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
        UserModule,
        OrganizationModule
      ],
    }).compile();

    const dataSource = module.get(DataSource);
    const mainSeeder = new MainSeeder();

    console.log('🌱 Running database seeders...');
    await mainSeeder.run(dataSource);
    
    seededRoles = mainSeeder.seededRoles;
    const adminRole = seededRoles.find(role => role.key === 'admin');
    adminRoleId = adminRole ? adminRole.id : '';
    
    console.log('✅ Database seeding completed');
    service = module.get(UserService);
    organizationService = module.get(OrganizationService);

    const organization = await organizationService.create({
      name: `Org_${process.pid}_${Date.now()}`,
    });

    organizationId = await organization.data.id;
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

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: name,
        email: email,
        password: password,
        roleIds: [adminRoleId]
      };

      const result = await service.create(newUser, organizationId);
      userId = result.data.id;

      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(newUser.name);
      expect(result.data.email).toBe(newUser.email);
    });
    
    it('should give error if email already exists', async () => {
      const newUser = {
        name: 'Test User',
        email: email,
        password: 'Test@1234',
        roleIds: [adminRoleId]
      };
      try {
        await service.create(newUser, organizationId);
      } catch (err) {
        expect(err.message).toContain('email already exists');
      }
    });
  })

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = await service.findOne(userId);
      expect(user.data).toBeDefined();
      expect(user.data.id).toBe(userId);
      userData = user.data;
    });
    
    it('should give error if user not found', async () => {
      const nonExistentUserId = '00000000-0000-0000-0000-000000000000'; 

      try {
        await service.findOne(nonExistentUserId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = await service.findAllUser(userData);
      expect(users).toBeDefined();
      expect(users.data.length).toBeGreaterThan(0);
    });

    it("get all cached user", async () => {
      const cachedUser = await service.findAllCachedUser(userData);
      expect(cachedUser).toBeDefined();
      expect(cachedUser.data.length).toBeGreaterThan(0);
    })
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updatedUser = {
        ...userData,
        name: 'Updated User',
      };

      const result = await service.update(updatedUser);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(updatedUser.name);
      expect(result.data.email).toBe(updatedUser.email);
    });

    it('should give error if user not found', async () => {
      const updatedUser = {
        ...userData,
        email: 'test@gmail.com',
      };

      try {
        await service.update(updatedUser);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const result = await service.remove(userData.id);
      expect(result.success).toBe(true);
    });

    it('should give error if user not found', async () => {
      const nonExistentUserId = '00000000-0000-0000-0000-000000000000';

      try {
        await service.findOne(nonExistentUserId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
