import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // @Post()
  // create(@Body() createFriendDto: CreateFriendDto) {
  //   return this.friendsService.createFriend(createFriendDto);
  // }
  // @Get('accept')
  // async accept(id :string ) {
  //   return this.friendsService.acceptFriend(id)
  // }

  // @Delete()
  // async remove(id : string) {
  //   return this.friendsService.removeFriend(id);
  // }

  // @Get('getFriendList')
  // async getFriendList(id :string) {
  //   return await this.friendsService.getFriendList(id);
  // }
  // @Get('getFriendReqList')
  // async getFriendReqList(id :string) {
  //   return await this.friendsService.getFriendReqList(id);
  // }
}
