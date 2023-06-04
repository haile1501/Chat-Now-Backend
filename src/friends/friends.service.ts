import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { createFriendID } from 'src/utils/ids';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}
  // async createFriend(createFriendDto: CreateFriendDto) {
  //   const newFriend = this.friendsRepository.create({
  //     ...createFriendDto,
  //   });
  //   return this.friendsRepository.save(newFriend);
  // }
  // async acceptFriend(id: string) {
  //   const friend = await this.findFriend(id);
  //   friend.acceptStatus = true;
  //   return this.friendsRepository.save(friend);
  // }
  // async getFriendReqList(userReceiveId: string) {
  //   const friendReqList = await this.friendsRepository.find({
  //     where: { userReceiveEmail: userReceiveId, acceptStatus: false },
  //   });
  //   return friendReqList;
  // }
  // async getFriendList(userId: string) {
  //   const friendList = await this.friendsRepository.find({
  //     where: { userReceiveEmail: userId, acceptStatus: true },
  //   });
  //   return friendList;
  // }
  // async findFriend(id: string) {
  //   const friend = await this.friendsRepository.findOneBy({
  //     id: id,
  //   });
  //   return friend;
  // }

  // async removeFriend(id: string) {
  //   const friendRemove = await this.findFriend(id);
  //   return this.friendsRepository.remove(friendRemove);
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} friend`;
  // }
}
