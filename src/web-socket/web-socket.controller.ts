import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
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

    @Post("/login")
    async loginUser(@Body() body: { id: string }, @Session() session: any) {
        const { id } = body;
        
        const user = await this.websocketService.checkUserExists(id);

        if (!user) {
            throw new Error(`User with id ${id} does not exist.`);
        }

        session.userId = id;

        return { message: 'Login successful', userId: id };
    }
}
