import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { NotificationsService } from "./notifications.service";
import { ConversationsService } from "src/conversations/conversations.service";
import { MessagesService } from "src/messages/messages.service";
import { FriendsService } from "src/friends/friends.service";
import { UsersService } from "src/users/users.service";
import { OneToOne } from "typeorm";
import { FriendStatus, NotificationType, OnlineStatus } from "src/constant/constant";
import { CreateFriendDto } from "src/friends/dto/create-friend.dto";
import { emit } from "process";
import { UpdateFriendDto } from "src/friends/dto/update-friend.dto";
import { AddUserDto } from "src/conversations/dto/update-conversation.dto";
import { AddUserSocketDto } from "src/conversations/dto/add-friend-socket.dto";

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
    console.log(client.data)
      await this.userService.changeStatusUser(client.data.userId,OnlineStatus.ON);
      const updatedNotification = await this.userService.getNotification(client.data.userId);
      await client.join(client.data.email);
      this.io.to(client.data.email).emit('get',updatedNotification);
  }
  async handleDisconnect(client: Socket) {
      await this.userService.changeStatusUser(client.data.userId,OnlineStatus.OFF);
  }
  @SubscribeMessage('friend-request')
  async sendFriendReq(
    @MessageBody() createFriendReq : CreateFriendDto,
    @ConnectedSocket() client : Socket,
  ){
    await this.friendService.createFriendReq(createFriendReq,client.data.userId);
    const newNoti = await this.notificationsService.createNoti(NotificationType.NEW_FRIEND_REQUEST,createFriendReq.receiverId);
    const updatedNotification = await this.userService.getNotification(client.data.email);
    this.io.to(client.data.email).emit('get',updatedNotification);
  }
  @SubscribeMessage('friend-response')
  async reponseFriendReq(
    @MessageBody() updateFriendDto : UpdateFriendDto,
    @ConnectedSocket() client : Socket,
  ){
    const friendReq = await this.friendService.responseFriend(updateFriendDto.requestId,updateFriendDto.status);
    const friend = await this.friendService.findOneDetail(friendReq.friendId);
    console.log(friend.receiver);
    const type = updateFriendDto.status === FriendStatus.Accepted ? NotificationType.NEW_FRIEND_ACCPECTED : NotificationType.NEW_FRIEND_REFUSED
    await this.notificationsService.createNoti(type,friend.sender.userId);
    const updatedNotification = await this.userService.getNotification(client.data.email);
    this.io.to(client.data.email).emit('get',updatedNotification);
  }
  @SubscribeMessage('join-group')
  async addedToGroup(
    @MessageBody() addUserDto : AddUserSocketDto,
    @ConnectedSocket() client : Socket,
  ){
      const updateConversation = await this.conversationService.addParticipants(addUserDto.conversationId,addUserDto.userId);
      const conversation = await this.conversationService.findOne(addUserDto.conversationId);
      const users = conversation.users;
      for(let i = 0; i < users.length ; i++){
        await this.notificationsService.createNoti(NotificationType.A_NEW_MEMBER_ADDED,users[i].userId);
      }
      const updatedNotification = await this.userService.getNotification(client.data.userId);
      this.io.to(client.data.email).emit('get',updatedNotification);
  }
}