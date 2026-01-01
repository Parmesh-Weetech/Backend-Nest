import { Module } from '@nestjs/common';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity.js';
import { UserModule } from '../user/user.module.js';
import { PermissionModule } from '../permission/permission.module.js';
import { RoleModule } from '../role/role.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { OrganizationModule } from '../organization/organization.module.js';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule, UserModule, PermissionModule, RoleModule, OrganizationModule]
})
export class PostModule { }
