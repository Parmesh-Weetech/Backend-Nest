import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { APIResponse } from '../common/response/response.dto';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

import { WebsocketService } from './websocket.service';

@UseGuards(AuthGuard, CurrentUserGuard)
@Controller('websocket')
export class WebsocketController {
    constructor(
        private readonly websocketService: WebsocketService
    ) { }

    @Get('conversations/:otherUserId')
    async findOrCreateConversation(
        @Param('otherUserId') otherUserId: string,
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        return await this.websocketService.findOrCreateConversation(user.id, otherUserId);
    }

    @Get('messages/:conversationId')
    async findMessages(
        @Param('conversationId') conversationId: string,
        @Query('_start') start = '0',
        @Query('_limit') limit = '15'
    ): Promise<APIResponse> {
        const skip = Math.max(parseInt(start, 10), 0);
        const take = Math.min(parseInt(limit, 10), 100);

        return await this.websocketService.findMessages(conversationId, skip, take);
    }
}
