import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsMiddleware } from '../common/middlewares/permission.middleware.js';
import { AuthModule } from '../auth/auth.module.js';
import { UserModule } from '../user/user.module.js';
import { RoleModule } from '../role/role.module.js';
import { OrganizationModule } from '../organization/organization.module.js';

import { PermissionController } from './permission.controller.js';
import { PermissionService } from './permission.service.js';
import { Permission } from './entities/permission.entity.js';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionsMiddleware],
  imports: [TypeOrmModule.forFeature([Permission]), forwardRef(() => RoleModule), forwardRef(() => UserModule), forwardRef(() => OrganizationModule), forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  exports: [PermissionService]
})
export class PermissionModule { }
