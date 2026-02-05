import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';

import { NotificationService } from './notification.service';
import { NotificationDto } from './dtos/create-notification.dto';
import { APIResponse } from '../common/response/response.dto';

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Post()
    async send(@Body() body: NotificationDto): Promise<APIResponse> {
        return await this.notificationService.create(
            body.senderId,
            body.conversationId,
            body.message,
            body.date,
            body.time,
            body.timezone
        );
    }
}
