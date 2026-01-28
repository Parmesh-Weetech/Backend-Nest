// src/video/video-sse.controller.ts
import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Controller('video')
export class VideoSseController {
    private videoEvents = new Subject<MessageEvent>();

    // This endpoint listens to events that are emitted
    @Sse('events') // The client will subscribe to this endpoint
    sse(): Observable<MessageEvent> {
        return this.videoEvents.asObservable();
    }

    // Method to send success events to the frontend
    sendSuccess(videoId: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status: 'success' } });
    }

    // Method to send error events to the frontend
    sendError(videoId: string, error: string) {
        this.videoEvents.next(<MessageEvent>{ data: { videoId, status: 'error', error } });
    }
}
