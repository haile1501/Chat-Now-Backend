import { Injectable } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { CallType } from 'src/constant/constant';

@Injectable()
export class CallService {
  constructor(@InjectRepository(Call) private readonly callRepository : Repository<Call>,
  private conversationService : ConversationsService){}
  async createCallHistory(conversationId : string, userId : number, callType : CallType){
    const conversation : Conversation = await this.conversationService.findUserInConversation(conversationId); 
    const user  = conversation.users.filter((user) => user.userId === userId);
    const callHistory = await this.callRepository.create({
      time : new Date(),
      conversation,
      user : user[0],
      type : callType,
    })
    return await this.callRepository.save(callHistory);
  }
  async listHistory(userId : number){
    return await this.callRepository.createQueryBuilder('call')
    .innerJoinAndSelect('call.user', 'user')
    .where("\"userId\" = : useId ",{userId})
    .getMany()
  }
}
