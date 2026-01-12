import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import type { Response } from 'express';
import { Auth } from '../common/util/auth';

@Controller('websocket')
export class WebsocketController {
    constructor(
        private readonly websocketService: WebsocketService,
        private readonly auth: Auth
    ) { }

    @Get('conversations/:otherUserId')
    async getOrCreateConversation(
        @Param('otherUserId') otherUserId: string,
        @Headers("Authorization") authorization: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) {
            return res.status(401).send({ success: false, message: "Unauthorized access! Token is not valid." });
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) {
            res.status(400).json({ success: false, expired: true, message: "Token expired!" });
        }

        const decodedPayload = await this.auth.decode(access_token)

        return await this.websocketService.findOrCreateConversation(otherUserId, decodedPayload.sub);
    }

    @Get('messages/:conversationId')
    async getMessages(
        @Param('conversationId') conversationId: string,
        @Headers("Authorization") authorization: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) {
            return res.status(401).send({ success: false, message: "Unauthorized access! Token is not valid." });
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) {
            res.status(400).json({ success: false, expired: true, message: "Token expired!" });
        }

        return await this.websocketService.getMessages(conversationId);
    }
}
