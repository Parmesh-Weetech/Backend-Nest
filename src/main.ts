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
import { Queue } from 'bullmq';
import compression from 'compression';
import { DataSource } from 'typeorm';
import 'multer'
import helmet from 'helmet';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { HttpErrorFilter } from './common/exceptions/global.exception';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { PermissionsMiddleware } from './common/middlewares/permission.middleware';
import { MainSeeder } from '../db/seeders/main.seed';

async function bootstrap() {
  try {
    const app =
      await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error'],
      });

    const configService = app.get(ConfigService);

    const authMiddleware = app.get(AuthMiddleware);
    const permissionsMiddleware = app.get(PermissionsMiddleware);

    /* -------------------- DB SEEDING -------------------- */
    if (configService.get('AUTO_SEED')) {
      const dataSource = app.get(DataSource);
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('🌱 Running database seeders...');
      await new MainSeeder().run(dataSource);
      console.log('✅ Database seeding completed');
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
