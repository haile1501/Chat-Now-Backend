import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { NotificationsService } from "./notifications.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessagesService } from "src/messages/messages.service";
import { FriendsService } from "src/friends/friends.service";
import { UsersService } from "src/users/users.service";

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect,OnGatewayInit
{
  @WebSocketServer() io;
  afterInit():void {
  }
  constructor(
    private readonly notificationsService : NotificationsService,
    private readonly conversationService : ConversationsService,    
    private readonly messageService : MessagesService,
    private readonly friendService : FriendsService,
    private readonly userService : UsersService
  ){}

  async handleConnection(client: Socket) {
      console.log(client.data.userId);
      const updatedNotification = await this.userService.getNotification(client.data.userId);
      this.io.emit('get',updatedNotification);
  }
  async handleDisconnect(client: Socket) {

  }
}