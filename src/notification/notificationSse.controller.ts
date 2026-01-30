import { Controller, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { NotificationSseService } from './notificationSse.service';
import { Observable } from 'rxjs';

@Controller('video')
export class NotificationSseController {
    constructor(private readonly notificationSseService: NotificationSseService) { }

    @Sse('events')
    events(): Observable<MessageEvent> {
        return this.notificationSseService.asObservable();
    }
}
