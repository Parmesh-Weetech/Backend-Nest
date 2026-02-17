import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { OrganizationModule } from '../organization/organization.module';
import { CacheModule } from '../cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { PostgresUserRepository } from './postgres-user.repository';
import { MongoUserRepository } from './mongo-user.repository';
import { USERS_REPOSITORY } from './user.repository.interface';
import { RoleDocument, RoleSchema } from '../role/schemas/role.schema';
import { PermissionDocument, PermissionSchema } from '../permission/schemas/permission.schema';
import { OrganizationDocument, OrganizationSchema } from '../organization/schemas/organization.schema';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  providers: [
    UserService,
    PostgresUserRepository,
    MongoUserRepository,
    createDatabaseRepositoryProvider(
      USERS_REPOSITORY,
      PostgresUserRepository,
      MongoUserRepository,
    ),
  ],
  imports: [
  TypeOrmModule.forFeature([User]),
  MongooseModule.forFeature([
    { name: UserDocument.name, schema: UserSchema },
    { name: RoleDocument.name, schema: RoleSchema },
    { name: PermissionDocument.name, schema: PermissionSchema },
    { name: OrganizationDocument.name, schema: OrganizationSchema },
  ]),
  forwardRef(() => AuthModule),
  forwardRef(() => RoleModule),
  forwardRef(() => PermissionModule),
  forwardRef(() => OrganizationModule), CacheModule],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
