import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { AuthGuard } from '../common/guards/auth.guard';
import { NotificationDto } from './dtos/notification.dto';

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

    // @Get()
    // @UseInterceptors(CurrentUserInterceptor)
    // async findOne(@CurrentUser() user: User) {
    //     return await this.notificationService.findOne(user);
    // }
}
