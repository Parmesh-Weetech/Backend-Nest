import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User /* UserSchema */])], // forFeature method used to registers feature-specific providers (entities, repositories, models). Here we can also use entity-schema instead of entity
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
