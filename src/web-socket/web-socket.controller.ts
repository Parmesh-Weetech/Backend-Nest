import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common';
import { WebSocketService } from './web-socket.service.js';
import { AuthGuard } from '../common/guards/auth.guard.js';

@UseGuards(AuthGuard)
@Controller('web-socket')
export class WebSocketController {

    constructor(private readonly websocketService: WebSocketService) { }
    
    @Get('conversations/:userId/:otherUserId')
    async getOrCreateConversation(@Param('userId') userId: string, @Param('otherUserId') otherUserId: string) {
        return await this.websocketService.findOrCreateConversation(userId, otherUserId);
    }   

    @Get('messages/:conversationId')
    async getMessages(@Param('conversationId') conversationId: string) {
        return await this.websocketService.getMessages(conversationId);
    }
}
