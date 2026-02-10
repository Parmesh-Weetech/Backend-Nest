import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { OrganizationModule } from '../organization/organization.module';
import { CacheModule } from '../cache/cache.module';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([UserRepository]), forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => OrganizationModule), CacheModule],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
