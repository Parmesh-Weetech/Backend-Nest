import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ClassSerializerInterceptor, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor.js';
import { HttpErrorFilter } from './common/exceptions/global.exception.js';
import { DataSource } from 'typeorm';
import { MainSeeder } from '../db/seeders/main.seed.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error']
    });

    const configService = app.get(ConfigService);

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    const auto_seed = configService.get("AUTO_SEED");

    if (auto_seed) {
      const dataSource = app.get(DataSource);

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('🌱 Running database seeders...');
      await new MainSeeder().run(dataSource);
      console.log('✅ Database seeding completed');
    }

    const notificationQueue = app.get<Queue>(
      'BullQueue_notifications',
    );

    createBullBoard({
      queues: [new BullMQAdapter(notificationQueue)],
      serverAdapter,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      new LoggingInterceptor(),
    );

    app.useGlobalFilters(new HttpErrorFilter());

    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });


    const config = new DocumentBuilder()
      .setTitle('H-catpcha example')
      .setDescription('H-captcha API description')
      .setVersion('1.0')
      .addTag('H-captcha')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app
      .getHttpServer()
      .use('/admin/queues', serverAdapter.getRouter());

    await app.listen(configService.get("PORT") ?? 3000, '0.0.0.0');

  } catch (error: any) {
    console.error('Error starting server:', error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
  }
}

bootstrap();