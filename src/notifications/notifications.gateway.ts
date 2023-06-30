import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { MessagesService } from 'src/messages/messages.service';
import { FriendsService } from 'src/friends/friends.service';
import { UsersService } from 'src/users/users.service';
import { OneToOne } from 'typeorm';
import {
  CallType,
  FriendStatus,
  NotificationType,
  OnlineStatus,
} from 'src/constant/constant';
import { CreateFriendDto } from 'src/friends/dto/create-friend.dto';
import { emit } from 'process';
import { UpdateFriendDto } from 'src/friends/dto/update-friend.dto';
import { AddUserDto } from 'src/conversations/dto/update-conversation.dto';
import { AddUserSocketDto } from 'src/conversations/dto/add-friend-socket.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { CallService } from 'src/call/call.service';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() io;
  afterInit(): void {}
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessagesService,
    private readonly friendService: FriendsService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const user = await this.userService.findOne(client.data.email);
    if (user.onlineStatus !== OnlineStatus.CALL) {
      await this.userService.changeStatusUser(
        client.data.userId,
        OnlineStatus.ON,
      );
      const updatedNotification = await this.userService.getNotification(
        client.data.userId,
      );
      await client.join(client.data.email);
      client.broadcast.emit('noti:user-status-change', {
        userId: client.data.userId,
        status: OnlineStatus.ON,
      });
      this.io.to(client.data.email).emit('get', updatedNotification);
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userService.findOne(client.data.email);

    if (user.onlineStatus === OnlineStatus.ON) {
      await this.userService.changeStatusUser(
        client.data.userId,
        OnlineStatus.OFF,
      );
      client.broadcast.emit('noti:user-status-change', {
        userId: client.data.userId,
        status: OnlineStatus.OFF,
      });
    } else if (user.onlineStatus === OnlineStatus.CALL) {
      await this.userService.changeStatusUser(
        client.data.userId,
        OnlineStatus.ON,
      );
      client.broadcast.emit('noti:user-status-change', {
        userId: client.data.userId,
        status: OnlineStatus.ON,
      });
    }
  }

  @SubscribeMessage('friend-request')
  async sendFriendReq(
    @MessageBody() createFriendReq: CreateFriendDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.friendService.createFriendReq(
      createFriendReq,
      client.data.userId,
    );
    const newNoti = await this.notificationsService.createNoti(
      NotificationType.NEW_FRIEND_REQUEST,
      createFriendReq.receiverId,
    );
    const receiver = await this.userService.getUserById(
      createFriendReq.receiverId,
    );
    const updatedNotification = await this.userService.getNotification(
      receiver.userId,
    );
    this.io.to(receiver.email).emit('noti:friend-request', updatedNotification);
  }
  @SubscribeMessage('friend-response')
  async reponseFriendReq(
    @MessageBody() updateFriendDto: UpdateFriendDto,
    @ConnectedSocket() client: Socket,
  ) {
    const friendReq = await this.friendService.responseFriend(
      updateFriendDto.requestId,
      updateFriendDto.status,
    );
    const friend = await this.friendService.findOneDetail(friendReq.friendId);
    console.log(friend.receiver);
    const type =
      updateFriendDto.status === FriendStatus.Accepted
        ? NotificationType.NEW_FRIEND_ACCPECTED
        : NotificationType.NEW_FRIEND_REFUSED;
    await this.notificationsService.createNoti(type, friend.sender.userId);
    const updatedNotification = await this.userService.getNotification(
      client.data.email,
    );
    this.io
      .to(client.data.email)
      .emit('noti:friend-response', updatedNotification);
  }
  @SubscribeMessage('join-group')
  async addedToGroup(
    @MessageBody() addUserDto: AddUserSocketDto,
    @ConnectedSocket() client: Socket,
  ) {
    const updateConversation = await this.conversationService.addParticipants(
      addUserDto.conversationId,
      addUserDto.userId,
    );
    const conversation = await this.conversationService.findUserInConversation(
      addUserDto.conversationId,
    );
    const users = conversation.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId != client.data.userId) {
        await this.notificationsService.createNoti(
          NotificationType.A_NEW_MEMBER_ADDED,
          users[i].userId,
        );
        const updatedNotification = await this.userService.getNotification(
          users[i].userId,
        );
        this.io.to(users[i].email).emit('noti:join-group', updatedNotification);
      }
    }
  }
  @SubscribeMessage('leave-group')
  async leaveGroup(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.conversationService.removeParticipants(
      conversationId,
      client.data.userId,
    );
    const conversation = await this.conversationService.findUserInConversation(
      conversationId,
    );
    const users = conversation.users;
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId != client.data.userId) {
        await this.notificationsService.createNoti(
          NotificationType.LEAVE_CONVERSATION,
          users[i].userId,
        );
        const updatedNotification = await this.userService.getNotification(
          users[i].userId,
        );
        this.io
          .to(users[i].email)
          .emit('noti:leave-group', updatedNotification);
      }
    }
  }
  @SubscribeMessage('send-noti')
  async sendMess(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const conversation = await this.conversationService.fineOneInDetailed(
      conversationId,
      client.data.userId,
    );
    const users = conversation.member;
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId != client.data.userId) {
        await this.notificationsService.createNoti(
          NotificationType.NEW_MESSAGE,
          users[i].userId,
        );
        const updatedNotification = await this.userService.getNotification(
          users[i].userId,
        );
        const notiMessNotRead =
          await this.notificationsService.countMessNotReadInOneConversation(
            conversationId,
            users[i].userId,
          );
        const num = notiMessNotRead.length;
        const notificationDetail = {
          ...updatedNotification,
          num,
        };
        this.io
          .to(users[i].email)
          .emit('noti:messageNotRead', notificationDetail);
      }
    }
  }

  @SubscribeMessage('call')
  async call(
    @MessageBody('type') type: string,
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.userService.changeStatusUser(
      client.data.userId,
      OnlineStatus.CALL,
    );

    await this.conversationService.updateConversationCall(
      conversationId,
      type as CallType,
      'call',
    );

    client.broadcast.emit('noti:user-status-change', {
      userId: client.data.userId,
      status: OnlineStatus.CALL,
    });

    const conversation = await this.conversationService.findUserInConversation(
      conversationId,
    );

    conversation.users.forEach((user) => {
      if (user.userId !== client.data.userId) {
        this.io.to(user.email).emit('noti:calling', {
          caller: client.data,
          type,
          conversationId,
        });
      }
    });

    return 'ok';
  }

  @SubscribeMessage('join-call')
  async handleJoinCall(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.userService.changeStatusUser(
      client.data.userId,
      OnlineStatus.CALL,
    );

    await this.conversationService.updateConversationCall(
      conversationId,
      null,
      'join',
    );

    client.broadcast.emit('noti:user-status-change', {
      userId: client.data.userId,
      status: OnlineStatus.CALL,
    });

    return 'ok';
  }

  @SubscribeMessage('leave-call')
  async handleLeaveCall(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const conversation = await this.conversationService.updateConversationCall(
      conversationId,
      null,
      'leave',
    );

    if (conversation.callType === CallType.NoCall) {
      const conversation =
        await this.conversationService.findUserInConversation(conversationId);

      conversation.users.forEach((user) => {
        this.io.to(user.email).emit('noti:end-call', {
          conversationId,
        });
      });
    }

    return 'ok';
  }

  @SubscribeMessage('reject-private-call')
  async handleRejectPrivateCall(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {}

  @SubscribeMessage('noti:group-created')
  async handleGroupCreated(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const conversation = await this.conversationService.fineOneInDetailed(
      body.id,
      client.data.userId,
    );

    const users = conversation.member;
    for (let i = 0; i < users.length; i++) {
      this.io.to(users[i].email).emit('noti:added-to-group', body);
    }
  }

  @SubscribeMessage('noti:member-added')
  async handleMemberAdded(
    @MessageBody('conversation') body: any,
    @MessageBody('ids') ids: Array<any>,
    @ConnectedSocket() client: Socket,
  ) {
    for (let i = 0; i < ids.length; i++) {
      const user = await this.userService.getUserById(ids[i]);
      this.io.to(user.userId).emit('noti:added-to-group', body);
    }
  }
}
