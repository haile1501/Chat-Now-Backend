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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('message')
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Controller('message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @ApiOperation({ summary: 'response friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 201, description: 'create message successfully '})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post('/:id')
  async sendMessage(@Param('id') conversationId : string,@Req() request : Request,@Body() createMessageDto : CreateMessageDto){
    const user = request['user'];
    return this.messagesService.sendMess(createMessageDto.content,conversationId,user);
  }
}
