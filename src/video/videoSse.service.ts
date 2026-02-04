// src/video/video-sse.controller.ts
import { Sse, MessageEvent, Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { TraceSpan } from 'src/common/decorators/trace.span.decorator';

@Injectable()
export class VideoSseService {
    private videoEvents = new Subject<MessageEvent>();

    asObservable(): Observable<MessageEvent> {
        return this.videoEvents.asObservable();
    }

    @TraceSpan()
    sendSuccess(videoId: string, status: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status } });
    }

    @TraceSpan()
    sendError(videoId: string, error: string, status: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status: status, error } });
    }
}

