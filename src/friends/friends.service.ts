import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { createFriendID } from 'src/utils/ids';
import { FriendStatus } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}
  async createFriend(createFriendDto: CreateFriendDto) {
    const requestTime = new Date();
    const status = FriendStatus.Waiting;
    const newFriend = this.friendsRepository.create({
      ...createFriendDto,
      requestTime,
      status,
    });
    return this.friendsRepository.save(newFriend);
  }
  async responseFriend(request_id: number , option : FriendStatus) {
    const friend = await this.friendsRepository.findOne({where : {friendId : request_id}});
    friend.status = option;
    return this.friendsRepository.save(friend);
  }
  async unfriend(request_id: number) {
    const friendRemove = await this.friendsRepository.findOne({where : {friendId : request_id}});
    return this.friendsRepository.remove(friendRemove);
  }
  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
