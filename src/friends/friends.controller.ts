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
import { FriendsService } from './friends.service';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { FriendStatus } from 'src/constant/constant';
import { CreateFriendDto } from './dto/create-friend.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Controller('friend')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @ApiOperation({ summary: 'send friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 201, description: 'create successfully '})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post()
  async sendFriendRequest(@Body() createFriendDto : CreateFriendDto ,@Req() request : Request){
    const userId = request['user'].userId;
    return await this.friendsService.createFriendReq(createFriendDto,userId);
  }
  @ApiOperation({ summary: 'response friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'OK '})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Post(':requestId')
  async responseFriendRequest(@Param('requestId') friendId : number,option : FriendStatus){
    return await this.friendsService.responseFriend(friendId, option);
  }

  @ApiOperation({ summary: 'retrieve friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'OK '})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Get()
  async findAll(@Query('page') page : number,@Query('size') size: number,
  @Query('option') option : string, @Req() request: Request ) {
    const userId = request['user'].userId;
    return await this.friendsService.findAllFriendReq(page,size,option,userId);
  }

  @ApiOperation({ summary: 'delete friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'OK '})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Delete(':requestId')
  async unFriendReq(@Param('requestId') friendId : number){
    return this.friendsService.unfriend(friendId);
  }
  @Get('getProfile/:id')
  async getProfile(@Param('id') findId : number, @Req() request : Request){
    const userId = request['user'].userId;
    return this.friendsService.getUserProfile(userId,findId);
  }
}
