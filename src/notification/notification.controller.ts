import { Body, Controller, Get, Headers, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';

import { NotificationService } from './notification.service';
import { NotificationDto } from './dtos/create-notification.dto';
import { APIResponse } from '../common/response/response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly configService: ConfigService
    ) { }

    @UseGuards(AuthGuard)
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

    @Get(":notificationId")
    async fetchNotificationById(@Param("notificationId") notificationId: string, @Headers("x-internal-secret") secret: string): Promise<APIResponse> {
        const secret_code = this.configService.get<string>("SECRET")
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized access!" });

        return await this.notificationService.fetchNotificationById(notificationId)
    }

    @Put(":notificationId")
    async updateNotificationById(
        @Body() body: { data: { message: string, status: "SENT" | "FAILED" | "PENDING", senderId?: string, createdAt?: Date, conversationId?: string } },
        @Param("notificationId") notificationId: string,
        @Headers("x-internal-secret") secret: string): Promise<APIResponse> {

        const secret_code = this.configService.get<string>("SECRET");
        if (secret !== secret_code) throw new UnauthorizedException({ message: "Unauthorized access!" });

        return await this.notificationService.updateNotificationById(notificationId, body.data.message, body.data.status, body.data.senderId, body.data.createdAt, body.data.conversationId);
    }
}
