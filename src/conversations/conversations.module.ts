import { Module } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';


@Module({
  imports : [TypeOrmModule.forFeature([Conversation])],
  controllers: [Conversation],
  providers: [ConversationsService],
  exports : [ConversationsService],
})
export class ConversationsModule {}
