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
import {
  AddUserDto,
  UpdateConversationDto,
} from './dto/update-conversation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('conversation')
@UseGuards(HttpAuthGuard)
@ApiBearerAuth()
@Controller('conversation')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @ApiOperation({ summary: 'retrieve conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async retrieveConversations(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    const userId = request['user'].userId;

    return await this.conversationsService.findConversation(page, size, userId);
  }

  @ApiOperation({ summary: 'create conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 201, description: 'create successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async createConversation(
    @Req() request: Request,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const user = request['user'].userId;
    return this.conversationsService.createConversation(
      user,
      createConversationDto.groupName,
      createConversationDto.userIds,
      createConversationDto.type,
    );
  }

  @ApiOperation({ summary: 'leave conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'leave successfully' })
  @Post('/:conversationId/leave')
  async leaveConversation(
    @Req() request: Request,
    @Param('conversationId') conversationId: string,
  ) {
    const user = request['user'].userId;
    return await this.conversationsService.leaveConversation(
      user,
      conversationId,
    );
  }

  @ApiOperation({ summary: 'get one conversation ' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Get('/:id/member')
  async getOne(@Param('id') conversationId: string) {
    return await this.conversationsService.findUserInConversation(
      conversationId,
    );
  }

  @ApiOperation({ summary: 'get one conversation ' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Get('/:id/message')
  async getAllMess(
    @Param('id') conversationId: string,
    @Req() request: Request,
  ) {
    const user = request['user'].userId;
    return await this.conversationsService.GetAll(conversationId, user);
  }

  @ApiOperation({ summary: 'update conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Patch('/:id/member')
  async updateConversation(
    @Param('id') conversationId: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return await this.conversationsService.updateConversation(
      conversationId,
      updateConversationDto.groupName,
    );
  }

  @ApiOperation({ summary: 'retrieve conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Post('/:conversationId/member')
  async addMember(
    @Param('conversationId') conversationId: string,
    @Body() addUserDto: AddUserDto,
  ) {
    return await this.conversationsService.addParticipants(
      conversationId,
      addUserDto.userId,
    );
  }
  @ApiOperation({ summary: 'delete conversation' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Delete('/:conversationId/member/:memberId')
  async removeMember(
    @Param('conversationId') conversationId: string,
    @Param('memberId') userId: number,
  ) {
    return await this.conversationsService.removeParticipants(
      conversationId,
      userId,
    );
  }
}
