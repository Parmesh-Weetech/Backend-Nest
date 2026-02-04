// src/video/video-sse.controller.ts
import { Controller, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { VideoSseService } from './videoSse.service';
import { Observable } from 'rxjs';
import { TraceSpan } from 'src/common/decorators/trace.span.decorator';

@Controller('video')
export class VideoSseController {
    constructor(private readonly videoSseService: VideoSseService) { }

    @Sse('events')
    @TraceSpan()
    events(): Observable<MessageEvent> {
        return this.videoSseService.asObservable();
    }
}
