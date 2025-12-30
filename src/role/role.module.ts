import { forwardRef, Module } from '@nestjs/common';
import { RoleController } from './role.controller.js';
import { RoleService } from './role.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity.js';
import { Permission } from '../permission/entities/permission.entity.js';
import { PermissionModule } from '../permission/permission.module.js';
import { UserModule } from '..//user/user.module.js';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role, Permission]), forwardRef(() => UserModule), forwardRef(() => PermissionModule)],
  exports: [RoleService]
})
export class RoleModule { }
