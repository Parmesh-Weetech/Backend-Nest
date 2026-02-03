import { Controller, Sse } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common';
import { NotificationSseService } from './notificationSse.service';
import { Observable } from 'rxjs';

@Controller('notification')
export class NotificationSseController {
    constructor(private readonly notificationSseService: NotificationSseService) { }

    @Sse('send')
    events(): Observable<MessageEvent> {
        return this.notificationSseService.asObservable();
    }
}
