import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer, MessageBody, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { WebsocketService } from './websocket.service';
import { Injectable, Res } from '@nestjs/common';
import { Auth } from '../common/util/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
})

export class Gateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly auth: Auth,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    try {

      const authorization = client.handshake.auth?.token;

      if (!authorization) {
        throw new WsException('Missing token');
      }

      const [type, token] = authorization.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new WsException('Invalid token');
      }

      const isValid = this.auth.verify(token)

      if (!isValid) throw new WsException("Token is expired!");

      const decoded = await this.auth.decode(token);
      client.data.userId = decoded.sub;

      const isUserExists = await this.userRepository.findOne({ where: { id: client.data.userId }});

      if(!isUserExists) throw new WsException("user not found!");

      console.log(`Client connected: ${client.id}`);
    } catch (err) {
      console.log('Unauthorized socket connection');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: { anotherUserId: string, _start?: number, _limit?: number },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.userId;

    if(!data._start || !data._limit) {
      data._limit = 15
      data._start = 1
    }

    const skip = Math.max(parseInt(data._start.toString(), 10), 0);
    const take = Math.min(parseInt(data._limit.toString(), 10), 100);

    const conversation = await this.webSocketService.findOrCreateConversation(userId, data.anotherUserId);
    const messages = await this.webSocketService.findMessages(conversation.id, skip, take);

    client.join(conversation.id);

    console.log(`Socket ${client.id} joined room ${conversation.id}`);

    client.emit('joined', { userId: userId, anotherUserId: data.anotherUserId, conversationId: conversation.id, messages: messages.length === 0 ? [] : messages });
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.userId;

    const newMessage = await this.webSocketService.sendMessage(data, userId);

    this.server.to(data.conversationId).emit('receive_message', {
      id: newMessage.id,
      content: newMessage.content,
      type: newMessage.type,
      conversation: newMessage.conversation,
      sender: newMessage.sender,
      attachments: newMessage.attachments?.map(data => ({
        id: data.media.id,
        url: data.url,
        mimeType: data.mimeType,
        mediaType: data.mediaType
      })),
      createdAt: newMessage.createdAt,
    });
  }
}
