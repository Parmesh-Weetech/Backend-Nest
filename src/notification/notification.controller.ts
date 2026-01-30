import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { NotificationDto } from './dtos/create-notification.dto';

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    send(@Body() body: NotificationDto) {
        return this.notificationService.create(
            body.senderId,
            body.conversationId,
            body.message,
            body.date,
            body.time,
            body.timezone
        );
    }
}
