import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { Repository } from 'typeorm';
import { createChatRoomID } from 'src/ids';

@Injectable()
export class ChatroomsService {
  constructor(@InjectRepository(Chatroom) private readonly chatroomRepository : Repository<Chatroom> ){}
  async create(id : string) {
    const newRoom = this.chatroomRepository.create({
      id
    });
    return this.chatroomRepository.save(newRoom);
  }
  async find(id :string){
    const chatroomFind = this.chatroomRepository.findOneBy({id:id})
    return chatroomFind;
  }
}
