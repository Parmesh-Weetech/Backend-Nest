import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
    constructor(
        private readonly supabaseService: SupabaseService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
        return await this.supabaseService.uploadFile(file, user);
    }
}
