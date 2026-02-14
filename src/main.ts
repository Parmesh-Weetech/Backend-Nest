import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { getModelToken } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import compression from 'compression';
import { DataSource } from 'typeorm';
import { Model } from 'mongoose';
import 'multer'
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { HttpErrorFilter } from './common/exceptions/global.exception';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { PermissionsMiddleware } from './common/middlewares/permission.middleware';
import { MainSeeder } from '../db/seeders/main.seed';
import { ROLES, PERMISSIONS } from '../db/Default_Values';
import { OrganizationDocument } from './organization/schemas/organization.schema';
import { RoleDocument } from './role/schemas/role.schema';
import { PermissionDocument } from './permission/schemas/permission.schema';
import { UserDocument } from './user/schemas/user.schema';

dotenv.config();

async function seedMongoData(
  app: NestExpressApplication,
  configService: ConfigService,
) {
  const organizationModel = app.get<Model<any>>(getModelToken(OrganizationDocument.name));
  const roleModel = app.get<Model<any>>(getModelToken(RoleDocument.name));
  const permissionModel = app.get<Model<any>>(getModelToken(PermissionDocument.name));
  const userModel = app.get<Model<any>>(getModelToken(UserDocument.name));

  const roleByKey = new Map<string, any>();
  for (const roleSeed of ROLES) {
    let role = await roleModel.findOne({
      key: roleSeed.key,
      organization: null,
      deleted_at: null,
    });

    if (!role) {
      role = await roleModel.create({
        key: roleSeed.key,
        label: roleSeed.label,
        description: roleSeed.description,
        organization: null,
        permissionIds: [],
      });
    }

    roleByKey.set(roleSeed.key, role);
  }

  for (const permissionSeed of PERMISSIONS) {
    const roleIds = permissionSeed.roles
      .map((roleKey) => roleByKey.get(roleKey)?._id?.toString())
      .filter(Boolean);

    let permission = await permissionModel.findOne({
      key: permissionSeed.key,
      entity: permissionSeed.entity,
      action: permissionSeed.action,
      organization: null,
      deleted_at: null,
    });

    if (!permission) {
      permission = await permissionModel.create({
        key: permissionSeed.key,
        label: permissionSeed.label,
        description: permissionSeed.description,
        entity: permissionSeed.entity,
        action: permissionSeed.action,
        organization: null,
        roles: roleIds,
      });
    } else {
      permission.roles = roleIds;
      await permission.save();
    }
  }

  const globalAdminRole = roleByKey.get('admin');
  if (globalAdminRole) {
    const adminPermissions = await permissionModel.find({
      organization: null,
      roles: { $in: [globalAdminRole._id.toString()] },
      deleted_at: null,
    });
    globalAdminRole.permissionIds = adminPermissions.map((permission) => permission._id.toString());
    await globalAdminRole.save();
  }

  const masterOrgName = configService.get<string>('MASTER_ORGANIZATION_NAME', 'Default');
  let masterOrganization = await organizationModel.findOne({
    name: masterOrgName,
    deleted_at: null,
  });

  if (!masterOrganization) {
    masterOrganization = await organizationModel.create({
      name: masterOrgName,
      users: [],
      config: {},
      deleted_at: null,
    });
  }

  const orgPermissions: any[] = [];
  if (globalAdminRole?.permissionIds?.length) {
    const globalPermissions = await permissionModel.find({
      _id: { $in: globalAdminRole.permissionIds },
      deleted_at: null,
    });

    for (const globalPermission of globalPermissions) {
      let orgPermission = await permissionModel.findOne({
        key: globalPermission.key,
        entity: globalPermission.entity,
        action: globalPermission.action,
        organization: masterOrganization._id.toString(),
        deleted_at: null,
      });

      if (!orgPermission) {
        orgPermission = await permissionModel.create({
          key: globalPermission.key,
          label: globalPermission.label,
          description: globalPermission.description,
          entity: globalPermission.entity,
          action: globalPermission.action,
          organization: masterOrganization._id.toString(),
          roles: [],
        });
      }

      orgPermissions.push(orgPermission);
    }
  }

  let orgAdminRole = await roleModel.findOne({
    key: 'admin',
    organization: masterOrganization._id.toString(),
    deleted_at: null,
  });

  if (!orgAdminRole) {
    orgAdminRole = await roleModel.create({
      key: 'admin',
      label: 'Admin',
      description: 'Organization admin',
      organization: masterOrganization._id.toString(),
      permissionIds: orgPermissions.map((permission) => permission._id.toString()),
    });
  } else {
    orgAdminRole.permissionIds = orgPermissions.map((permission) => permission._id.toString());
    await orgAdminRole.save();
  }

  for (const permission of orgPermissions) {
    permission.roles = [orgAdminRole._id.toString()];
    await permission.save();
  }

  const masterUserEmail = configService.get<string>('MASTER_USER_EMAIL', 'admin@example.com');
  const masterUserPassword = configService.get<string>('MASTER_USER_PASSWORD', 'Admin@123');
  const masterUserName = configService.get<string>('MASTER_USER_NAME', 'Master Admin');

  let masterUser = await userModel.findOne({ email: masterUserEmail });
  if (!masterUser) {
    const hashedPassword = await bcrypt.hash(masterUserPassword, 10);
    masterUser = await userModel.create({
      name: masterUserName,
      email: masterUserEmail,
      password: hashedPassword,
      organization: masterOrganization._id.toString(),
      roles: [orgAdminRole._id.toString()],
    });
  } else {
    masterUser.organization = masterOrganization._id.toString();
    masterUser.roles = [orgAdminRole._id.toString()];
    await masterUser.save();
  }

  await organizationModel.findByIdAndUpdate(masterOrganization._id.toString(), {
    $addToSet: { users: masterUser._id.toString() },
  });

  console.log(`✅ Mongo seed ready. Master user: ${masterUserEmail}`);
}

async function bootstrap() {
  try {
    const { AppModule } = await import('./app.module.js');

    const app =
      await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error'],
      });

    const configService = app.get(ConfigService);

    const authMiddleware = app.get(AuthMiddleware);
    const permissionsMiddleware = app.get(PermissionsMiddleware);

    /* -------------------- DB SEEDING -------------------- */
    if (configService.get('AUTO_SEED')) {
      const databaseProvider = (process.env.DATABASE_PROVIDER ?? '').toLowerCase();

      if (databaseProvider === 'postgres') {
        const dataSource = app.get(DataSource);
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }

        console.log('🌱 Running database seeders...');
        await new MainSeeder().run(dataSource);
        console.log('✅ Database seeding completed');
      } else if (databaseProvider === 'mongo' || databaseProvider === 'mongodb') {
        console.log('🌱 Running MongoDB seeders...');
        await seedMongoData(app, configService);
      } else {
        console.log('🌱 Skipping relational seeders for non-postgres provider');
      }
    }

    /* -------------------- BULL BOARD -------------------- */
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    const notificationQueue =
      app.get<Queue>('BullQueue_notifications');

    const videoProcessingQueue = app.get<Queue>('BullQueue_video-processing')

    createBullBoard({
      queues: [
        new BullMQAdapter(notificationQueue),
        new BullMQAdapter(videoProcessingQueue)
      ],
      serverAdapter,
    });

    app.use(helmet());

    app.use('/admin/queues',
      authMiddleware.use.bind(authMiddleware),
      permissionsMiddleware.use.bind(permissionsMiddleware),
      serverAdapter.getRouter()
    );

    app.use(compression());

    /* -------------------- GLOBAL SETUP -------------------- */

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      new LoggingInterceptor(),
    );

    app.useGlobalFilters(new HttpErrorFilter());

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    /* -------------------- SWAGGER -------------------- */
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    /* -------------------- START SERVER -------------------- */
    await app.listen(configService.get('PORT') ?? 3000, '0.0.0.0');

    console.log('🚀 Server started successfully');
  } catch (error: any) {
    console.error('Error starting server:', error);
    throw new HttpException(
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause: error },
    );
  }
}

bootstrap();
