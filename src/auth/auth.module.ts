import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../common/util/auth';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { OrganizationModule } from '../organization/organization.module';
import { HCaptchaModule } from '../h-captcha/h-captcha.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Refresh_token } from '../user/entities/refresh_token.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, AuthMiddleware, Auth],
  imports: [
    TypeOrmModule.forFeature([User, Refresh_token]),
    RoleModule,
    PermissionModule,
    OrganizationModule,
    HCaptchaModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
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