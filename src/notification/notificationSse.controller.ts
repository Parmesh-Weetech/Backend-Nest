import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { NotificationSseService } from './notificationSse.service';

@Controller('notification')
export class NotificationSseController {
    constructor(
        private readonly notificationSseService: NotificationSseService
    ) { }

    @Sse('send')
    events(): Observable<MessageEvent> {
        return this.notificationSseService.asObservable();
    }
}
