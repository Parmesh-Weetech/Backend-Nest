// src/video/video-sse.controller.ts
import { Controller, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { VideoSseService } from './videoSse.service';
import { Observable } from 'rxjs';

@Controller('video')
export class VideoSseController {
    constructor(private readonly videoSseService: VideoSseService) { }

    @Sse('events')
    events(): Observable<MessageEvent> {
        return this.videoSseService.asObservable();
    }
}
