import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { NotificationsService } from "./notifications.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessagesService } from "src/messages/messages.service";
import { FriendsService } from "src/friends/friends.service";
import { UsersService } from "src/users/users.service";

WebSocketGateway({
  namespace: 'noti'
})
export class NotificationsGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly notificationsService : NotificationsService,
    private readonly conversationService : ConversationsService,    
    private readonly messageService : MessagesService,
    private readonly friendService : FriendsService,
    private readonly userService : UsersService
  ){}
  @WebSocketServer() io: Namespace
  afterInit():void {
    console.log(`Websocket Gateway initialized.`)
  }
  async handleConnection(client: Socket) {
    const updatedNotification = await this.userService.getNotification(client.data.userId)
    client.emit('get',updatedNotification);   
  }
  async handleDisconnect(client: Socket) {
      
  }
}