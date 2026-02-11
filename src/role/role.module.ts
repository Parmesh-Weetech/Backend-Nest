import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionModule } from '../permission/permission.module';

import { AuthModule } from '../auth/auth.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  imports: [TypeOrmModule.forFeature([RoleRepository]), forwardRef(() => UserModule), forwardRef(() => PermissionModule), OrganizationModule, forwardRef(() => AuthModule)],
  exports: [RoleService]
})
export class RoleModule { }
