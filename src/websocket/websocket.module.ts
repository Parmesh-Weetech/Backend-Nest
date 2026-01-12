import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { GatewayGateway } from './gateway/gateway.gateway';
import { GatewayGateway } from './gateway';

@Module({
  controllers: [WebsocketController],
  providers: [WebsocketService, GatewayGateway]
})
export class WebsocketModule { }
