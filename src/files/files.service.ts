import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { files } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
    constructor(
        @Inject(forwardRef(() => SupabaseService))
        private readonly supabase: SupabaseService,
        private readonly config: ConfigService,
        @InjectRepository(files)
        private readonly fileRepository: Repository<files>
    ) { }

    
    async save(userId: string, bucket: string, filePath: string): Promise<boolean> {
        const saveFile = this.fileRepository.create({
            user_id: userId,
            bucket: bucket,
            path: filePath
        })

        const savedFile = await this.fileRepository.save(saveFile);

        if(saveFile.id) {
            return true;
        }

        return false;
    }
}
