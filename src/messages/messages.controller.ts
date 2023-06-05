import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ConversationByIdDto,
  ConversationDto,
} from './dto/get-conversation.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // async create(@Body() createMessageDto : CreateMessageDto){
  //   const result = await this.messagesService.sendMess(createMessageDto);
  //   return result;
  // }
  // @Get('getroom')
  // async getConversation(@Body() conversationInf : ConversationDto){
  //   return this.messagesService.getAnConversation(conversationInf);
  // }
  // @Get('getroomById')
  // async getConversationById(@Body() conversationByIdDto : ConversationByIdDto){
  //   console.log(`hello`);
  //   return this.messagesService.getAnConversationById(conversationByIdDto);
  // }
}
