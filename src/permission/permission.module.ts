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
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionDocument, PermissionSchema } from './schemas/permission.schema';
import { PERMISSION_REPOSITORY } from './permission.repository.interface';
import { PostgresPermissionRepository } from './postgres-permission.repository';
import { MongoPermissionRepository } from './mongo-permission.repository';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionsMiddleware,
    PostgresPermissionRepository,
    MongoPermissionRepository,
    createDatabaseRepositoryProvider(
      PERMISSION_REPOSITORY,
      PostgresPermissionRepository,
      MongoPermissionRepository,
    ),
  ],
  imports: [
    TypeOrmModule.forFeature([Permission]),
    MongooseModule.forFeature([
      {
        name: PermissionDocument.name,
        schema: PermissionSchema,
      },
    ]),
    forwardRef(() => RoleModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  exports: [PermissionService]
})
export class PermissionModule { }
