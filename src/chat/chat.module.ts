import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateWay } from './chat.gateway';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports : [ChatModule,ConversationsModule,MessagesModule],
  providers: [ChatService,ChatGateWay],
  exports : [ChatService]
})
export class ChatModule {}
