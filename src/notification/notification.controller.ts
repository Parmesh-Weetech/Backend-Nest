import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly service: NotificationService) { }

    @Post()
    send(@Body() body: any) {
        return this.service.create(
            body.senderId,
            body.receiverId,
            body.message,
        );
    }
}
