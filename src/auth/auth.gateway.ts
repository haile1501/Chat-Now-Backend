import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace } from "socket.io";
import { Logger } from "@nestjs/common";

import { MessagesService } from "src/messages/messages.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";
import { AuthDto, SocketWithAuth } from "src/users/guard-users";
import { FriendsService } from "src/friends/friends.service";
import { CreateMessageDto } from "src/messages/dto/create-message.dto";
import { ConversationDto } from "src/messages/dto/get-conversation.dto";
import { sortBy } from 'lodash';
import { ConversationsService } from "src/conversations/conversations.service";
@WebSocketGateway({
    namespace: 'auths',
})
export class AuthsGateWay implements OnGatewayConnection, OnGatewayDisconnect , OnGatewayInit
{
    private readonly logger = new Logger(AuthsGateWay.name);
    constructor(private readonly messagesService : MessagesService,
        private readonly jwtService : JwtService,
        private readonly authService : AuthService,
        private readonly usersService : UsersService,
        private readonly friendService : FriendsService,
        private readonly conversationService : ConversationsService){}

    @WebSocketServer() io: Namespace;
    afterInit(): void {
        this.logger.log(`Websocket Gateway initialized.`);
    }

    async handleConnection(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        this.logger.log(`WS Client with id: ${client.id} connected!`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
        const token = client.handshake.query.token as string;
        console.log(`${token}`);
        const user = await this.authService.verifyAccessToken(token);
        const parseUser = JSON.parse(JSON.stringify(user));
        console.log('User:', parseUser.id);
        client.data.user = JSON.parse(JSON.stringify(user));
        const friendReqList = await this.friendService.getFriendReqList(parseUser.id);
        const f = JSON.parse(JSON.stringify(friendReqList));
        console.log('FriendList:', f);
        this.logger.debug(
            `userID: ${client.data.user.id} joined room with name: ${client.data.user.firstName}`,
        );
    }

    async handleDisconnect(client: SocketWithAuth) {
        const sockets = this.io.sockets;
        this.logger.log(`Disconnected socket id: ${client.data.user.id}`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    }
    

    @SubscribeMessage('join_room')
    async join_room(
        @MessageBody() room : ConversationDto,
        @ConnectedSocket() client : SocketWithAuth) :Promise<any>
    {
        if(!this.conversationService.find(room.roomId)){
            const newRoom = this.conversationService.create(room.roomId);
        }
        const conversation = await this.messagesService.getAnConversation(room)
        console.log(conversation);
        client.data.roomId = room.roomId;
        await client.join(room.roomId);
        this.io.to(room.roomId).emit('get_message', sortBy(conversation,'timeSend'));
        // client.emit('get_mess',conversation);
    }

    @SubscribeMessage('send_mess')
    async send_mess(
        @MessageBody() messageSend : CreateMessageDto ,
        @ConnectedSocket() client : SocketWithAuth) :Promise<void> 
    {
        if(!this.conversationService.find(messageSend.roomId)){
            const newRoom = this.conversationService.create(messageSend.roomId);
        }
        messageSend.userSendId = client.data.user.id;
        const newMess = await this.messagesService.sendMess(messageSend);
        this.logger.debug(
            `new message : ${newMess.context}` 
        );
        client.data.roomId = newMess.roomId;
        this.logger.debug(
            `join room : ${newMess.roomId}` 
        );
        await client.join(newMess.roomId);
        const conversation = await this.conversationService.find(messageSend.roomId);
        this.io.to(client.data.roomId).emit('send_message', newMess);
    }
}