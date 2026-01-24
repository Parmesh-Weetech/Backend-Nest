import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class VideoService {

    async processVideo(file: Express.Multer.File) {
        const videoId = randomUUID();


    }
}
