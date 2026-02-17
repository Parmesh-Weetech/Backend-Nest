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

import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { HttpErrorFilter } from './common/exceptions/global.exception';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { PermissionsMiddleware } from './common/middlewares/permission.middleware';
import { MainSeeder } from '../db/seeders/main.seed';
import { ROLES, PERMISSIONS } from '../db/Default_Values';
import { RoleDocument } from './role/schemas/role.schema';
import { PermissionDocument } from './permission/schemas/permission.schema';
import { UserDocument } from './user/schemas/user.schema';

dotenv.config();

async function seedMongoData(
  app: NestExpressApplication,
) {
  const roleModel = app.get<Model<any>>(getModelToken(RoleDocument.name));
  const permissionModel = app.get<Model<any>>(getModelToken(PermissionDocument.name));

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
  console.log('✅ Mongo seed ready. Roles and permissions seeded.');
}

async function ensureMongoUserIndexes(app: NestExpressApplication) {
  const userModel = app.get<Model<any>>(getModelToken(UserDocument.name));

  try {
    const indexes = await userModel.collection.indexes();
    const hasLegacyEmailIndex = indexes.some((index: any) => index?.name === 'email_1');

    if (hasLegacyEmailIndex) {
      await userModel.collection.dropIndex('email_1');
      console.log('🧹 Dropped legacy Mongo index: users.email_1');
    }
  } catch (error: any) {
    // Ignore "index not found" and proceed with creating target index.
    if (error?.codeName !== 'IndexNotFound') {
      throw error;
    }
  }

  await userModel.collection.createIndex(
    { organization: 1, email: 1 },
    { unique: true, name: 'organization_1_email_1' },
  );
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
        await seedMongoData(app);
      } else {
        console.log('🌱 Skipping relational seeders for non-postgres provider');
      }
    }

    const databaseProvider = (process.env.DATABASE_PROVIDER ?? '').toLowerCase();
    if (databaseProvider === 'mongo' || databaseProvider === 'mongodb') {
      await ensureMongoUserIndexes(app);
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
      // authMiddleware.use.bind(authMiddleware),
      // permissionsMiddleware.use.bind(permissionsMiddleware),
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
