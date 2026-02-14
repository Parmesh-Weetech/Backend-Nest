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

const databaseProvider = process.env.DATABASE_PROVIDER?.toLowerCase();
const isPostgres = databaseProvider === 'postgres';
const isMongo = databaseProvider === 'mongo' || databaseProvider === 'mongodb';

@Module({
  providers: [UserService, {
    provide: USERS_REPOSITORY,
    useClass:
      isPostgres
        ? PostgresUserRepository
        : MongoUserRepository,
  }],
  imports: [...(isPostgres
    ? [TypeOrmModule.forFeature([User])]
    : []),

  ...(isMongo
    ? [
      MongooseModule.forFeature([
        { name: UserDocument.name, schema: UserSchema },
      ]),
    ]
    : []), forwardRef(() => AuthModule),
  forwardRef(() => RoleModule),
  forwardRef(() => PermissionModule),
  forwardRef(() => OrganizationModule), CacheModule],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
