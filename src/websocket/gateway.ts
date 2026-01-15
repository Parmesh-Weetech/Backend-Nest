import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer, MessageBody, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dtos/sendMessage.dto';
import { WebsocketService } from './websocket.service';
import { Injectable, Res } from '@nestjs/common';
import { Auth } from '../common/util/auth';

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
    private readonly auth: Auth
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

      if(!isValid) throw new WsException("Token is expired!");

      const decoded = await this.auth.decode(token);
      client.data.userId = decoded.sub;

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
    @MessageBody() data: { anotherUserId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.userId;

    console.log(userId);
    console.log(data.anotherUserId);
    
    const conversation = await this.webSocketService.findOrCreateConversation(userId, data.anotherUserId);
    
    client.join(conversation.id);

    console.log(`Socket ${client.id} joined room ${conversation.id}`);
    
    client.emit('joined', { userId: userId, anotherUserId: data.anotherUserId, conversationId: conversation.id });
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.userId;

    const newMessage = await this.webSocketService.sendMessage(data, userId);

    client.broadcast.to(data.conversationId).emit('receive_message', {
      content: newMessage.content,
      type: newMessage.type,
      conversationId: data.conversationId,
      senderId: userId,
      receiverId: data.receiverId,
      createdAt: newMessage.createdAt,
    });
  }

  @SubscribeMessage("get_history")
  async handleGetHistory(
    @MessageBody() data: { conversationId: string }, 
    @ConnectedSocket() client: Socket
  ) {
    console.log(`History request received from ${client.id} for conversation ${data.conversationId}`);

    const messages = await this.webSocketService.getMessages(data.conversationId);

    client.emit('history', messages);

    return { status: 'History fetched', messages: messages };
  }
}
