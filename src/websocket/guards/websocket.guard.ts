import { CanActivate, ExecutionContext, Injectable, Res } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Auth } from '../../common/util/auth.js'; // your Auth class
import { WsException } from '@nestjs/websockets';
import type { Response } from 'express';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly auth: Auth,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const authorization = client.handshake.auth?.token;

        const [type, token] = authorization?.split(' ') ?? [];
        const final_token = type === "Bearer" ? token : undefined

        if (!final_token) throw new WsException('Unauthorized: No token');

        try {
            const isValid = await this.auth.verify(final_token);

            if (!isValid) {
                throw new WsException('Unauthorized: Token expired!');
            }

            const decodedPayload = await this.auth.decode(final_token);

            client.data.user = decodedPayload.sub;

            console.log(decodedPayload.sub)
            return true;
        } catch (err) {
            throw new WsException('Unauthorized: Invalid token');
        }
    }
}
