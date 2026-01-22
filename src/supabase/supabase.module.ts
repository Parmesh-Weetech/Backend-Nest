import { forwardRef, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service.js';
import { FilesModule } from '../files/files.module.js';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
  imports: [forwardRef(() => FilesModule)]
})
export class SupabaseModule {}
