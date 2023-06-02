import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConversationsService {
  constructor(@InjectRepository(Conversation) private readonly conversationRepository : Repository<Conversation> ){}
  async create(id : string) {
    const newRoom = this.conversationRepository.create({
      id
    });
    return this.conversationRepository.save(newRoom);
  }
  async find(id :string){
    const chatroomFind = this.conversationRepository.findOneBy({id:id})
    return chatroomFind;
  }
}
