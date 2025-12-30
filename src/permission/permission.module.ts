import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller.js';
import { PermissionService } from './permission.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity.js';
import { RoleModule } from '../role/role.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [TypeOrmModule.forFeature([Permission]), forwardRef(() => RoleModule), forwardRef(() => UserModule)],
  exports: [PermissionService]
})
export class PermissionModule { }
