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
@UseGuards(HttpAuthGuard)
@Controller('friend')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Post()
  async sendFriendRequest(@Body() createFriendDto : CreateFriendDto ,@Req() request : Request){
    const userId = request['user'].userId;
    return await this.friendsService.createFriendReq(createFriendDto,userId);
  }
  @Post(':requestId')
  async responseFriendRequest(@Param('requestId') friendId : number,option : FriendStatus){
    return await this.friendsService.responseFriend(friendId, option);
  }
  @Get()
  async findAll(@Query('page') page : number,@Query('size') size: number,
  @Query('option') option : string, @Req() request: Request ) {
    const userId = request['user'].userId;
    return await this.friendsService.findAllFriendReq(page,size,option,userId);
  }
  @Delete(':requestId')
  async unFriendReq(@Param('requestId') friendId : number){
    return this.friendsService.unfriend(friendId);
  }
}
