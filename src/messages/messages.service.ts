import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { createMessID } from 'src/utils/ids';
import { sortBy } from 'lodash';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  // constructor(
  //   @InjectRepository(Message)
  //   private readonly messagesRepository: Repository<Message>,
  //   private readonly 
  // ) {}

  // async sendMess(content : string,conversationId : string ,user : User) {
  //   const timeSend = new Date();
  //   const newMess = this.messagesRepository.create({
  //     ...createMessageDto,
  //     user,
  //     timeSend,
  //   });
  //   return this.messagesRepository.save(newMess);
  // }
}
