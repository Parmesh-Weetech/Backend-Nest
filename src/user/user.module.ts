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
import { UserSchema } from './schemas/user.schema';
import { PRODUCT_REPOSITORY } from 'src/product/product.repository.interface';
import { PostgresUserRepository } from './postgres-user.repository';
import { MongoUserRepository } from './mongo-user.repository';

@Module({
  providers: [UserService, {
    provide: PRODUCT_REPOSITORY,
    useClass:
      process.env.DATABASE_PROVIDER === 'postgres'
        ? PostgresUserRepository
        : MongoUserRepository,
  }],
  imports: [...(process.env.DATABASE_PROVIDER === 'postgres'
    ? [TypeOrmModule.forFeature([User])]
    : []),

  ...(process.env.DATABASE_PROVIDER === 'mongodb'
    ? [
      MongooseModule.forFeature([
        { name: 'user', schema: UserSchema },
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
