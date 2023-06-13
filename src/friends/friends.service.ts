import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { FriendStatus } from 'src/constant/constant';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly userSevice : UsersService,
  ) {}
  async createFriendReq(createFriendDto : CreateFriendDto , senderId : number){
    const requestTime = new Date();
    const status = FriendStatus.Waiting;
    const sender = await this.userSevice.getUserById(senderId);
    const receiver = await this.userSevice.getUserById(createFriendDto.receiverId);
    const newFriendReq = await this.friendsRepository.create(
      {
        requestTime,
        status,
        sender,
        receiver,
      }
    )
    return this.friendsRepository.save(newFriendReq);
  }  
  async responseFriend(friendId: number , option : FriendStatus) {
    const friend = await this.friendsRepository.findOne({where : {friendId : friendId}});
    friend.status = option;
    return this.friendsRepository.save(friend);
  }
  async unfriend(friendId: number) {
    const friendRemove = await this.friendsRepository.findOne({where : {friendId : friendId}});
    return this.friendsRepository.remove(friendRemove);
  }
  async findAllFriendReq(page : number , size : number,option : string, userId : number){
    const status = FriendStatus.Waiting;
    if(option === "sent"){
      return await this.friendsRepository.createQueryBuilder('friend')
      .leftJoinAndSelect("friend.receiver","user")
      .select()
      .where("\"senderId\" = :userId AND status = :status ", {userId : userId , status : status})
      .take(size)
      .skip((page - 1) * size)
      .getMany()
    }
    else{
      return await this.friendsRepository.createQueryBuilder('friend')
      .leftJoinAndSelect("friend.sender","user")
      .select()
      .where("\"receiverId\" = :userId AND status = :status ", {userId : userId , status : status})
      .take(size)
      .skip((page - 1) * size)
      .getMany()
    }
  }
  async findOneDetail(requestId : number){
    const friend :Friend =  await this.friendsRepository.createQueryBuilder('friend')
    .leftJoinAndSelect('friend.sender', 'user1')
    .leftJoinAndSelect('friend.receiver', 'user2')
    .where('friend.friendId = :friendId', { friendId: requestId })
    .getOne()
    return friend;
  }
}
