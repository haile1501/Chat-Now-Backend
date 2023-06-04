import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationMembersService } from './conversation-members.service';
import { CreateConversationMemberDto } from './dto/create-conversation-member.dto';
import { UpdateConversationMemberDto } from './dto/update-conversation-member.dto';

@Controller('conversation-members')
export class ConversationMembersController {
  constructor(private readonly conversationMembersService: ConversationMembersService) {}

  @Post()
  create(@Body() createConversationMemberDto: CreateConversationMemberDto) {
    return this.conversationMembersService.createNewConversation(createConversationMemberDto);
  }
}
