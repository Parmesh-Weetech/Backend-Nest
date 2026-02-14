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

@Module({
  controllers: [PostController],
  providers: [PostService, {
    provide: POSTS_REPOSITORY,
    useClass:
      process.env.DATABASE_PROVIDER === 'postgres'
        ? PostgresPostRepository
        : MongoPostRepository,
  }],
  imports: [...(process.env.DATABASE_PROVIDER === 'postgres'
    ? [TypeOrmModule.forFeature([PostEntity])]
    : []),

  ...((process.env.DATABASE_PROVIDER === 'mongodb' || process.env.DATABASE_PROVIDER === 'mongo')
    ? [
      MongooseModule.forFeature([
        { name: 'Post', schema: PostSchema },
      ]),
    ]
    : []), AuthModule, UserModule, PermissionModule, RoleModule, OrganizationModule]
})
export class PostModule { }
