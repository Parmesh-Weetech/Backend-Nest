import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { RoleModule } from '../role/role.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User]), RoleModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
