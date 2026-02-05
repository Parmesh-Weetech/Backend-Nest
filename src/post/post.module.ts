import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostEntity } from './entities/post.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule, UserModule, PermissionModule, RoleModule, OrganizationModule]
})
export class PostModule { }
