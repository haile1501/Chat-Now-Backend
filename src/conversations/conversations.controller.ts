import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AddUserDto, UpdateConversationDto } from './dto/update-conversation.dto';

@UseGuards(HttpAuthGuard)
@Controller('conversation')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
  @Get()
  async retrieveConversations(@Req() request : Request,@Query('page') page : number,@Query('size') size: number) {
    const userId = request['user'].userId;
    return await this.conversationsService.findConversation(page,size,userId);
  }
  @Post()
  async createConversation(@Req() request : Request,@Body() createConversationDto : CreateConversationDto){
    const user = request['user'].userId;
    return await this.conversationsService.createConversation(user,createConversationDto.groupName,createConversationDto.userIds);
  }
  @Post('/:conversationId/leave')
  async leaveConversation(@Req() request : Request , @Param('conversationId') conversationId : string){
    const user = request['user'].userId;
    return await this.conversationsService.leaveConversation(user,conversationId);
  }
  @Get('/:id/member')
  async getOne(@Param('id') conversationId : string ){
    return await this.conversationsService.findOne(conversationId);
  }

  @Patch('/:id/member')
  async updateConversation(@Param('id') conversationId : string, @Body() updateConversationDto : UpdateConversationDto){
    return await this.conversationsService.updateConversation(conversationId,updateConversationDto.groupName)
  }

  @Post('/:conversationId/member')
  async addMember(@Param('conversationId') conversationId : string, @Body() addUserDto : AddUserDto)
  {
    return await this.conversationsService.addParticipants(conversationId,addUserDto.userId);
  }
  @Delete('/:conversationId/member/:memberId')
  async removeMember(@Param('conversationId') conversationId : string, @Param('memberId') userId : number)
  {
    console.log(userId);
    return await this.conversationsService.removeParticipants(conversationId,userId);
  }
}
