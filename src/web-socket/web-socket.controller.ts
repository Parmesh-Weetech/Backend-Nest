import { Controller, Get, Param } from '@nestjs/common';
import { WebSocketService } from './web-socket.service.js';

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
