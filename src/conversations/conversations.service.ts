import { BadRequestException, Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
import { UNAVAILABLE_GROUP, UNAVAILABLE_USER, UNAVAILABLE_USER_IN_CONVERSATION } from 'src/constant/error.constant';
import { throwError } from 'rxjs';
import { forEach } from 'lodash';
import { createConversationID } from 'src/utils/ids';
import { ConversationType } from 'src/constant/constant';
import { type } from 'os';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService : UsersService,
  ) {}

  async findConversation(page : number, size : number, userId : number){
    return await this.conversationRepository.createQueryBuilder("conversation")
    .innerJoinAndSelect("conversation.users" , "user")
    .leftJoinAndSelect("user.messages","message")
    .select()
    .where("\"userId\" = :userId",{userId : userId})
    .take(size)
    .skip((page - 1) * size)
    .getMany()
  }

  async findOne(conversationId : string){
    return await this.conversationRepository.createQueryBuilder("conversation")
    .innerJoinAndSelect("conversation.users" , "user")
    .leftJoinAndSelect("user.messages","message")
    .select()
    .where("\"conversationId\" = :id",{id : conversationId})
    .getOne()
  }

  async createConversation(userCreateId : number ,groupName : string ,userIds : number[]){
    const conversationId = createConversationID();
    const type = userIds.length >= 2 ? ConversationType.Group : ConversationType.Private;
    const userCreate = await this.userService.getUserById(userCreateId);
    const users: User[] =[JSON.parse(JSON.stringify(userCreate))];
    const getUserPromises = userIds.map(async userId =>await this.userService.getUserById(userId)); 
    const member = await Promise.all(getUserPromises);
    
    users.push(...member);
    const newConversation = await this.conversationRepository.create({
      conversationId,
      groupName,
      type,
      users,
    });
    return this.conversationRepository.save(newConversation);
  }

  async leaveConversation(userId : number , conversationId :string){
    return this.removeParticipants(conversationId,userId);
  }

  async addParticipants(conversationId : string , userAddedId : number){
    const userAdded = await this.userService.getUserById(userAddedId);
    if(!userAdded){
      throw new BadRequestException({...UNAVAILABLE_USER,"userId":userAddedId});
    }
    const updatedConversation = await this.findOne(conversationId);
    if(!updatedConversation){
      throw new BadRequestException({...UNAVAILABLE_GROUP});
    }
    updatedConversation.users.push(userAdded);
    return this.conversationRepository.save(updatedConversation);
  }
  
  async removeParticipants(conversationId : string , userRemovedId : number){
    const userRemoved = await this.userService.getUserById(userRemovedId);
    if(!userRemoved){
      throw new BadRequestException({...UNAVAILABLE_USER});
    }
    const updatedConversation = await this.findOne(conversationId);
    if(!updatedConversation){
      throw new BadRequestException({...UNAVAILABLE_GROUP});
    }
    if(!updatedConversation.users.find(user => user.userId === userRemovedId)){
      throw new BadRequestException({...UNAVAILABLE_USER_IN_CONVERSATION});
    }
    else{
        updatedConversation.users = updatedConversation.users.filter((user) => user.userId != userRemovedId);
        return this.conversationRepository.save(updatedConversation);
    } 
  }

  async updateConversation(conversationId : string, groupName : string){
    return this.conversationRepository.update(conversationId,{groupName})
  }
}
