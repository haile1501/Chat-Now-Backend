import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { FriendStatus, UserStatus } from 'src/constant/constant';
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
  async getAllFriend(userId :number){
    const listReceived = await this.friendsRepository.createQueryBuilder('friend')
    .leftJoinAndSelect('friend.sender', 'user1')
    .leftJoinAndSelect('friend.receiver', 'user2')
    .where('\"senderId\" = :userId and status = :status ',{userId : userId, status : FriendStatus.Accepted})
    .getMany()
    const listSent = await this.friendsRepository.createQueryBuilder('friend')
    .leftJoinAndSelect('friend.sender', 'user1')
    .leftJoinAndSelect('friend.receiver', 'user2')
    .where('\"receiverId\" = :userId and status = :status ',{userId : userId, status : FriendStatus.Accepted})
    .getMany()
    console.log(listSent);
    const listFriend : User[] = [];
    for (let i = 0; i < listReceived.length; i++){
      
      listFriend.push(listReceived[i].receiver);
    }
    for (let j = 0; j < listSent.length; j++){
      console.log(listFriend);
      listFriend.push(listSent[j].sender);
    }
    return listFriend;
  }
  async getUserProfile(userId : number, findId : number){
    const receiver  =  await this.friendsRepository.createQueryBuilder('friend')
    .leftJoinAndSelect('friend.sender', 'user1')
    .leftJoinAndSelect('friend.receiver', 'user2')
    .where("\"senderId\" = :userId AND \"receiverId\" = :findId", { userId: userId,findId :findId })
    .getOne()
    const sender  =  await this.friendsRepository.createQueryBuilder('friend')
    .leftJoinAndSelect('friend.sender', 'user1')
    .leftJoinAndSelect('friend.receiver', 'user2')
    .where("\"senderId\" = :findId AND \"receiverId\" = :userId", { userId: userId,findId :findId })
    .getOne()
    const listUserFriend = await this.getAllFriend(userId);
    const listFindFriend = await this.getAllFriend(findId);
    let mutualFriends: number = 0;
    for(let i = 0; i <listFindFriend.length ; i++){
      for (let j = 0 ; j < listUserFriend.length ; j++){
        if(listFindFriend[i].userId == listUserFriend[j].userId){
          mutualFriends = mutualFriends + 1;
        }
      }
    }
    if(receiver){
      const status = receiver.status === FriendStatus.Accepted ? UserStatus.Friend : UserStatus.Waiting;
      const profile = {
        ...receiver.receiver,
        status,
        mutualFriends
      }
      return profile;
    }
    if(sender){
      const status = sender.status === FriendStatus.Accepted ? UserStatus.Friend : UserStatus.Waiting;
      const profile = {
        ...sender.sender,
        status,
        mutualFriends,
      }
      return profile;
    }
    else{
      const user = await this.userSevice.getUserById(findId);
      const status =  UserStatus.Strange;
      let profile = {
        ...user,
        status,
        mutualFriends,
      }
      return profile;
    }
  }
}
