// src/video/video-sse.controller.ts
import { Sse, MessageEvent, Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class VideoSseService {
    private videoEvents = new Subject<MessageEvent>();

    asObservable(): Observable<MessageEvent> {
        return this.videoEvents.asObservable();
    }

    sendSuccess(videoId: string, status: string, url: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status, url } });
    }

    sendError(videoId: string, error: string, status: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status: status, error } });
    }
}

