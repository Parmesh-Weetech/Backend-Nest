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
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './schemas/file.schema';
import { FILES_REPOSITORY } from './files.repository.interface';
import { PostgresFilesRepository } from './postgres-files.repository';
import { MongoFilesRepository } from './mongo-files.repository';

@Module({
  providers: [FilesService, {
    provide: FILES_REPOSITORY,
    useClass:
      process.env.DATABASE_PROVIDER === 'postgres'
        ? PostgresFilesRepository
        : MongoFilesRepository,
  },],
  controllers: [FilesController],
  imports: [
    AuthModule,
    UserModule,
    StorageModule,
    ...(process.env.DATABASE_PROVIDER === 'postgres'
      ? [TypeOrmModule.forFeature([Files])]
      : []),

    ...(process.env.DATABASE_PROVIDER === 'mongodb'
      ? [
        MongooseModule.forFeature([
          { name: 'File', schema: FileSchema },
        ]),
      ]
      : []),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    })],
  exports: [FilesService]
})
export class FilesModule { }
