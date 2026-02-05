import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module.js';
import { UserModule } from '../user/user.module.js';
import { PermissionModule } from '../permission/permission.module.js';

import { OrganizationService } from './organization.service.js';
import { OrganizationController } from './organization.controller.js';
import { Organization } from './entities/organization.entity.js';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [TypeOrmModule.forFeature([Organization]), forwardRef(() => PermissionModule), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
  exports: [OrganizationService]
})
export class OrganizationModule {}
