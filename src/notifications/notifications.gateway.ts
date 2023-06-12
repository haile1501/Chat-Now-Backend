import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets";
import { Namespace } from "socket.io";
import { NotificationsService } from "./notifications.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessagesService } from "src/messages/messages.service";
import { Socket } from "dgram";
import { FriendsService } from "src/friends/friends.service";

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
    private readonly friendService : FriendsService
  ){}
  @WebSocketServer() io: Namespace
  afterInit():void {
    console.log(`Websocket Gateway initialized.`)
  }
  async handleConnection(client: Socket) {
      
  }
  async handleDisconnect(client: Socket) {
      
  }
}