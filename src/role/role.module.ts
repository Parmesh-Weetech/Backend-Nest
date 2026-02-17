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
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDocument, RoleSchema } from './schemas/role.schema';
import { ROLE_REPOSITORY } from './role.repository.interface';
import { PostgresRoleRepository } from './postgres-role.repository';
import { MongoRoleRepository } from './mongo-role.repository';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    PostgresRoleRepository,
    MongoRoleRepository,
    createDatabaseRepositoryProvider(
      ROLE_REPOSITORY,
      PostgresRoleRepository,
      MongoRoleRepository,
    ),
  ],
  imports: [
    TypeOrmModule.forFeature([Role]),
    MongooseModule.forFeature([
      { name: RoleDocument.name, schema: RoleSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PermissionModule),
    OrganizationModule,
    forwardRef(() => AuthModule),
  ],
  exports: [RoleService]
})
export class RoleModule { }
