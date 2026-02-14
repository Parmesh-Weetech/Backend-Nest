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

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionsMiddleware, {
    provide: PERMISSION_REPOSITORY,
    useClass:
      process.env.DATABASE_PROVIDER === 'postgres'
        ? PostgresPermissionRepository
        : MongoPermissionRepository,
  }],
  imports: [...(process.env.DATABASE_PROVIDER === 'postgres'
    ? [TypeOrmModule.forFeature([Permission])]
    : []),

  ...((process.env.DATABASE_PROVIDER === 'mongodb' || process.env.DATABASE_PROVIDER === 'mongo')
    ? [
      MongooseModule.forFeature([
        {
          name: PermissionDocument.name,
          schema: PermissionSchema,
        },
      ]),
    ]
    : []), forwardRef(() => RoleModule), forwardRef(() => OrganizationModule), forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  exports: [PermissionService]
})
export class PermissionModule { }
