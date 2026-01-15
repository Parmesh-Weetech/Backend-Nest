import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { RoleModule } from '../role/role.module.js';
import { UserModule } from '../user/user.module.js';
import { OrganizationModule } from '../organization/organization.module.js';
import { PermissionModule } from '../permission/permission.module.js';
import { HCaptchaModule } from '../h-captcha/h-captcha.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Refresh_token } from '../user/entities/refresh_token.entity.js';
import { Auth } from '../common/util/auth.js';
import { WebsocketModule } from '../websocket/websocket.module.js';

@Module({
  providers: [AuthService, Auth],
  imports: [
    TypeOrmModule.forFeature([User, Refresh_token]),
    RoleModule,
    forwardRef(() => UserModule),
    OrganizationModule,
    PermissionModule,
    HCaptchaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, Auth]
})
export class AuthModule { }
