import { Injectable, OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { NotificationSseService } from './notificationSse.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationGateway implements OnModuleInit {

  constructor(
    private readonly notificationSseService: NotificationSseService,
    private readonly configService: ConfigService
  ) { }

    async onModuleInit() {
    }
}
