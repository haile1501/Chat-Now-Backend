import { Logger, Param, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guard/auth.guard';
import { ChatService } from './chat.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { SocketWithAuth } from 'src/users/guard-users';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { CreateConversationDto } from 'src/conversations/dto/create-conversation.dto';

@WebSocketGateway()
export class ChatGateWay {
  @WebSocketServer() io;
  afterInit(): void {}

  constructor(
    private readonly chatService: ChatService,
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessagesService,
  ) {}

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(conversationId);
    const updatedConversation = await this.conversationService.findOne(
      conversationId,
    );
    this.io.to(conversationId).emit('join_room', updatedConversation);
  }
  @SubscribeMessage('send')
  async sendMess(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = createMessageDto.conversationId;
    const updateConversation = await this.messageService.sendMess(
      createMessageDto.content,
      roomName,
      client.data as User,
    );
    client.to(roomName).emit('receive', updateConversation);
  }
}
