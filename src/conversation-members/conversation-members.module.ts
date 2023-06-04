import { Module } from '@nestjs/common';
import { ConversationMembersService } from './conversation-members.service';
import { ConversationMembersController } from './conversation-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMember } from './entities/conversation-member.entity';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports :[TypeOrmModule.forFeature([ConversationMember]),ConversationsModule],
  controllers: [ConversationMembersController],
  providers: [ConversationMembersService],
  exports: [ConversationMembersService]
})
export class ConversationMembersModule {}
