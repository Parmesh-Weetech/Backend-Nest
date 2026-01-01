import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { RoleModule } from '../role/role.module.js';
import { PermissionModule } from '../permission/permission.module.js';
import { OrganizationModule } from '../organization/organization.module.js';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), RoleModule, PermissionModule, OrganizationModule],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
