import { MessageEvent, Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationSseService {
    private notificationEvents = new Subject<MessageEvent>();

    asObservable(): Observable<MessageEvent> {
        return this.notificationEvents.asObservable();
    }

    sendSuccess(notificationId: string, message: string, senderId: string, createdAt: Date, conversationId: string, status: string) {
        this.notificationEvents.next(<MessageEvent>{ data: { notificationId, message, senderId, createdAt, conversationId, status } });
    }

    sendError(notificationId: string, error: string, status: string) {
        this.notificationEvents.next(<MessageEvent>{ data: { notificationId, error, status } });
    }
}

