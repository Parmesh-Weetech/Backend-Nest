import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';

import AppConfig from './config/app.config';
import DatabaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    BullModule.forRoot({
      connection: {
        url: "redis://localhost:6379",
        host: 'localhost',
        port: 6379,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),
    UserModule, AuthModule, RoleModule, PermissionModule, PostModule, OrganizationModule, HCaptchaModule, WebsocketModule, ProductModule, CacheModule, NotificationModule, QueueModule, VideoModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimeMiddleware).forRoutes('*');
  }
}