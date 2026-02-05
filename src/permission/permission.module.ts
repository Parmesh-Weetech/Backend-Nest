import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsMiddleware } from '../common/middlewares/permission.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { OrganizationModule } from '../organization/organization.module';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionsMiddleware],
  imports: [TypeOrmModule.forFeature([Permission]), forwardRef(() => RoleModule), forwardRef(() => OrganizationModule), forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  exports: [PermissionService]
})
export class PermissionModule { }
