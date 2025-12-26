import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([Auth, User])],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
