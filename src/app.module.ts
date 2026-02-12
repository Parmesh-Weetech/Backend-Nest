import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

import AppConfig from './config/app.config';
import DatabaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { RequestTimeMiddleware } from './common/middlewares/requestTime.middleware';
import { OrganizationModule } from './organization/organization.module';
import { HCaptchaModule } from './h-captcha/h-captcha.module';
import { ProductModule } from './product/product.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CacheModule } from './cache/cache.module';
import { NotificationModule } from './notification/notification.module';
import { QueueModule } from './queue/queue.module';
import { VideoModule } from './video/video.module';
import { CartModule } from './cart/cart.module';
import Redis from 'ioredis';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);

        return {
          connection: redisUrl
            ? { url: redisUrl }
            : { host: redisHost, port: redisPort }
        };
      }
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 1
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          })
        )
      })
    }),
    UserModule, AuthModule, RoleModule, PermissionModule, PostModule, OrganizationModule, HCaptchaModule, WebsocketModule, ProductModule, CacheModule, NotificationModule, QueueModule, VideoModule, CartModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimeMiddleware).forRoutes('*');
  }
}