import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { memoryStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { files } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    forwardRef(() => SupabaseModule), 
    AuthModule,
    TypeOrmModule.forFeature([files]),
    MulterModule.register({
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  })],
  exports: [FilesService]
})
export class FilesModule { }
