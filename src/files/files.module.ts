import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { memoryStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { Files } from './entities/File.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    AuthModule,
    StorageModule,
    TypeOrmModule.forFeature([Files]),
    UserModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    })],
  exports: [FilesService]
})
export class FilesModule { }
