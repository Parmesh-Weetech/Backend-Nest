import { Controller, Get, Param } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Controller('websocket')
export class WebsocketController {
    constructor(private readonly websocketService: WebsocketService) { }

    @Get('conversations/:userId/:otherUserId')
    async getOrCreateConversation(@Param('userId') userId: string, @Param('otherUserId') otherUserId: string) {
        return await this.websocketService.findOrCreateConversation(userId, otherUserId);
    }

    @Get('messages/:conversationId')
    async getMessages(@Param('conversationId') conversationId: string) {
        return await this.websocketService.getMessages(conversationId);
    }
}
