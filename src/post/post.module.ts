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
import { POSTS_REPOSITORY } from './post.repository.interface';
import { PostgresPostRepository } from './postgres-post.repository';
import { MongoPostRepository } from './mongo-post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/post.schema';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostgresPostRepository,
    MongoPostRepository,
    createDatabaseRepositoryProvider(
      POSTS_REPOSITORY,
      PostgresPostRepository,
      MongoPostRepository,
    ),
  ],
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
    ]),
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    OrganizationModule,
  ]
})
export class PostModule { }
