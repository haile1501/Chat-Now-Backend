import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { createMessID } from 'src/utils/ids';
import { sortBy } from 'lodash';
import { User } from 'src/users/entities/user.entity';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async sendMess(content : string,conversationId : string ,user : User) {
    const timeSend = new Date();
    const conversation = await this.messagesRepository
    .createQueryBuilder()
    .select("conversation")
    .from(Conversation, "conversation")
    .where("conversation.conversationId = :id", { id: conversationId })
    .getOne()

    const newMess = this.messagesRepository.create({
      content,
      conversation,
      user,
      timeSend,
    });
    await this.messagesRepository.save(newMess);
    return this.messagesRepository.createQueryBuilder()
    .select("conversation")
    .from(Conversation,"conversation")
    .innerJoinAndSelect("conversation.users" , "user")
    .leftJoinAndSelect("user.messages","message")
    .where("conversation.conversationId = :id", { id: conversationId })
    .getOne()
  }
}
