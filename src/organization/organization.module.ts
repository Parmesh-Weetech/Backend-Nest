import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service.js';
import { OrganizationController } from './organization.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity.js';
import { PermissionModule } from '../permission/permission.module.js';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [TypeOrmModule.forFeature([Organization]), forwardRef(() => PermissionModule)],
  exports: [OrganizationService]
})
export class OrganizationModule {}
