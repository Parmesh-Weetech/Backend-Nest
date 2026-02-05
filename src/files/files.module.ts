import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { StorageModule } from '../storage/storage.module';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Files } from './entities/File.entity';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    AuthModule,
    UserModule,
    StorageModule,
    TypeOrmModule.forFeature([Files]),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    })],
  exports: [FilesService]
})
export class FilesModule { }
