import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';

import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [TypeOrmModule.forFeature([Organization]), forwardRef(() => PermissionModule), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
  exports: [OrganizationService]
})
export class OrganizationModule {}
