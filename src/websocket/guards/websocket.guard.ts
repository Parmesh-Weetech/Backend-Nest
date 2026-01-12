import { CanActivate, ExecutionContext, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Auth } from '../../common/util/auth.js';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly auth: Auth,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const authorization = client.handshake.auth?.token;
        
        if (!authorization) {
            throw new WsException('Missing token');  
        } 

        const [type, token] = authorization?.split(' ') ?? [];
        const final_token = type === "Bearer" ? token : undefined

        if (final_token == undefined || final_token == null) throw new WsException('Unauthorized access! Invalid token');

        try {
            const isValid = await this.auth.verify(final_token);

            if (!isValid) {
                throw new WsException('Unauthorized: Token expired!');
            }

            const decodedPayload = await this.auth.decode(final_token);

            client.data.userId = decodedPayload.sub;

            return true;
        } catch (err) {
            throw new WsException('Unauthorized: Invalid token');
        }
    }
}
