import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { PostModule } from './post/post.module';
import { PostEntity } from './post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forRoot({ // forRoot method configures global providers(DB connection, cache, config, etc.)
    type: "postgres",
    host: "localhost",
    port: 5440,
    username: "div",
    password: "divpassword",
    database: "divdata",
    entities: [User, Auth, Role, Permission, PostEntity], // 
    synchronize: true, // don't use it in production because this will automatically update the table once we update the entity no need of migrations.
    autoLoadEntities: true // automatically loads entity into entities array don't need to add it manually. For this entity must need to register it in forFeature method of each module.
  }), UserModule, UserModule, AuthModule, RoleModule, PermissionModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
