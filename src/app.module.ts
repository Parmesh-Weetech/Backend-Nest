import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RoleModule } from './role/role.module.js';
import { PermissionModule } from './permission/permission.module.js';
import { PostModule } from './post/post.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppConfig from './config/app.config.js';
import DatabaseConfig from './config/database.config.js';
import { RequestTimeMiddleware } from './common/middlewares/requestTime.middleware.js';
import { OrganizationModule } from './organization/organization.module.js';
import { HCaptchaModule } from './h-captcha/h-captcha.module';
import { ProductModule } from './product/product.module';
import { WebsocketModule } from './websocket/websocket.module';

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
    }), UserModule, AuthModule, RoleModule, PermissionModule, PostModule, OrganizationModule, HCaptchaModule, WebsocketModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimeMiddleware).forRoutes('*');
  }
}