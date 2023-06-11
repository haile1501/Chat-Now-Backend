import { Logger, Param, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Namespace, Socket } from "socket.io"
import { WsAuthGuard } from "src/auth/guard/auth.guard"
import { ChatService } from "./chat.service"
import { ConversationsService } from "src/conversations/conversations.service"
import { SocketWithAuth } from "src/users/guard-users"
import { CreateMessageDto } from "src/messages/dto/create-message.dto";
import { MessagesService } from "src/messages/messages.service";
import { User } from "src/users/entities/user.entity";
import { CreateConversationDto } from "src/conversations/dto/create-conversation.dto";

@WebSocketGateway({
    namespace: 'chat'
})
export class ChatGateWay 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly chatService : ChatService,
        private readonly conversationService : ConversationsService,    
        private readonly messageService : MessagesService,
    ){}
    @WebSocketServer() io: Namespace
    afterInit():void {
        console.log(`Websocket Gateway initialized.`)
    }

    async handleConnection(client: Socket) {
        const sockets = this.io.sockets;
        const roomName = client.data.join_room;
        await client.join(roomName);
        const conversation = await this.conversationService.findOne(roomName);
        this.io.to(roomName).emit('join_room',conversation);
    }
    async handleDisconnect(client: Socket) {
    }
    @SubscribeMessage('send')
    async sendMess(
        @MessageBody() createMessageDto : CreateMessageDto,
        @ConnectedSocket() client : Socket
    ){
        const roomName = client.data.join_room;
        const updateConversation = await this.messageService.sendMess(createMessageDto.content,roomName,client.data as User); 
        console.log(updateConversation);
        this.io.to(roomName).emit('join_room',updateConversation);
    }
}