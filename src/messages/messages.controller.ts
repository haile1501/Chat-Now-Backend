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
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
@UseGuards(HttpAuthGuard)
@Controller('message')
export class MessagesController {
  // constructor(private readonly messagesService: MessagesService) {}
  // @Post()
  // async sendMessage(@Req() request : Request,@Body() createMessageDto : CreateMessageDto){
  //   const user = request['user'];
  //   return this.messagesService.sendMess(createMessageDto.content,createMessageDto.conversationId,user);
  // }
}
