import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import {
  ConversationByIdDto,
  ConversationDto,
} from './dto/get-conversation.dto';
import { createMessID } from 'src/utils/ids';
import { sortBy } from 'lodash';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async sendMess(createMessageDto: CreateMessageDto) {
    const timeSend = new Date();
    const newMess = this.messagesRepository.create({
      ...createMessageDto,
      timeSend,
    });
    return this.messagesRepository.save(newMess);
  }

  // async getAnConversation(conversationDto: ConversationDto) {
  //   const conversation = await this.messagesRepository.find({
  //     where: { roomId: conversationDto.roomId },
  //   });
  //   return sortBy(conversation, 'timeSend');
  // }

  // async getAnConversationById(conversationByIdDto: ConversationByIdDto) {
  //   const conversation = await this.messagesRepository.find({
  //     where: {
  //       roomId: conversationByIdDto.roomId,
  //       userSendId: conversationByIdDto.userSendId,
  //     },
  //   });
  //   return sortBy(conversation, 'timeSend');
  // }
}
