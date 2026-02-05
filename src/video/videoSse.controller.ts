import { Controller, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';

import { VideoSseService } from './videoSse.service';

@Controller('video')
export class VideoSseController {
    constructor(private readonly videoSseService: VideoSseService) { }

    @Sse('events')
    events(): Observable<MessageEvent> {
        return this.videoSseService.asObservable();
    }
}
