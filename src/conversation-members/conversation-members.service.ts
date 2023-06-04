import { Injectable } from '@nestjs/common';
import { CreateConversationMemberDto } from './dto/create-conversation-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationMember } from './entities/conversation-member.entity';
import { Repository } from 'typeorm';
import { ConversationsService } from 'src/conversations/conversations.service';
import { createConversationID } from 'src/ids';
import { UpdateConversationDto } from 'src/conversations/dto/update-conversation.dto';
import { UpdateConversationMemberDto } from './dto/update-conversation-member.dto';

@Injectable()
export class ConversationMembersService {
  constructor(@InjectRepository(ConversationMember) 
  private readonly cmRepository : Repository<ConversationMember>){}
  async addUser(addUser : UpdateConversationMemberDto){
    const newUser = await this.cmRepository.create(addUser);
    return this.cmRepository.save(newUser);
  }
  async removeUser(removeUser : UpdateConversationMemberDto){
    const userRemoved = await this.cmRepository.find({where : {userId : removeUser.userId,conversationId  : removeUser.conversationId}});
    return await this.cmRepository.remove(userRemoved);
  }
}
