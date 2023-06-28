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
import { ConversationType } from 'src/constant/constant';

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
    const conversation = await this.conversationService.fineOneInDetailed(
      roomName,
      client.data.userId,
    );
    if (conversation.type === ConversationType.Private) {
      const partner = conversation.member[0];
      conversation.groupName = `${partner.firstName} ${partner.lastName}`;
    }
    this.io.to(client.data.email).emit('noti:receive', conversation);
    if (conversation.type === ConversationType.Private) {
      conversation.groupName = `${client.data.firstName} ${client.data.lastName}`;
    }
    conversation.isMyLastMessage = false;
    const users = conversation.member;
    for (let i = 0; i < users.length; i++) {
      this.io.to(users[i].email).emit('noti:receive', conversation);
    }

    return updateConversation.messageId;
  }
}
