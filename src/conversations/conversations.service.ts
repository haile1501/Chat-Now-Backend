import { BadRequestException, Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';
import {
  UNAVAILABLE_GROUP,
  UNAVAILABLE_USER,
  UNAVAILABLE_USER_IN_CONVERSATION,
} from 'src/constant/error.constant';
import { throwError } from 'rxjs';
import { forEach, last } from 'lodash';
import { createConversationID } from 'src/utils/ids';
import { ConversationType } from 'src/constant/constant';
import { sortBy } from 'lodash';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly userService: UsersService,
  ) {}

  async findConversation(page: number, size: number, userId: number) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .leftJoinAndSelect('user.messages', 'message')
      .select()
      .where('"userId" = :userId', { userId: userId })
      .take(size)
      .skip((page - 1) * size)
      .getMany();
    let newObject: any[] = [];
    for (let i = 0; i < conversations.length; i++) {
      let conversation = await this.findOne(conversations[i].conversationId);
      let users = await this.findUserInConversation(
        conversations[i].conversationId,
      );
      if (conversation.messages.length != 0) {
        let lastMess = conversation.messages[conversation.messages.length - 1];
        let lastSend = lastMess.timeSend;
        let object = {
          ...conversation,
          lastMessage: lastMess,
          isMyLastMessage: lastMess.user.userId === userId,
          member: users.users.filter((user) => user.userId !== userId),
          timeSendLast: lastSend,
        };
        newObject.push(object);
      } else if (conversation.type === ConversationType.Group) {
        let lastMess = null;
        let lastSend = -1;
        let object = {
          ...conversation,
          lastMessage: lastMess,
          isMyLastMessage: false,
          member: users.users.filter((user) => user.userId !== userId),
          timeSendLast: lastSend,
        };
        newObject.push(object);
      }
    }
    const list = sortBy(newObject, ['timeSendLast']).reverse();
    return list;
  }
  async findOne(conversationId: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndSelect('message.user', 'user')
      .select()
      .where('"conversationId" = :id', { id: conversationId })
      .getOne();

    return conversation;
  }

  async GetAll(conversationId: string, userId: number) {
    const conversation = await this.findOne(conversationId);
    const messages = conversation.messages;
    let object: any[] = [];
    for (let i = 0; i < messages.length; i++) {
      let isMine = messages[i].user.userId == userId ? true : false;
      let x = { ...messages[i], isMine: isMine };
      object.push(x);
    }
    return object;
  }
  async findUserInConversation(conversationId: string) {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.users', 'user')
      .select()
      .where('"conversationId" = :id', { id: conversationId })
      .getOne();
  }

  async createConversation(
    userCreateId: number,
    groupName: string,
    userIds: number[],
    type: ConversationType,
  ) {
    const privateConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .select()
      .leftJoinAndSelect('conversation.users', 'user1')
      .leftJoinAndSelect('conversation.users', 'user2')
      .where(
        "user1.userId =:user1 AND user2.userId = :user2 AND type = 'private'",
        { user1: userCreateId, user2: userIds[0] },
      )
      .getOne();

    if (
      type == ConversationType.Private &&
      privateConversation &&
      userIds.length == 1
    ) {
      return privateConversation;
    } else {
      if (userIds.length != 1 && type === ConversationType.Private) {
        throw new Error('type private must have only 2 member');
      } else {
        const conversationId = createConversationID();
        const userCreate = await this.userService.getUserById(userCreateId);
        const users: User[] = [JSON.parse(JSON.stringify(userCreate))];
        const getUserPromises = userIds.map(
          async (userId) => await this.userService.getUserById(userId),
        );
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
    }
  }

  async leaveConversation(userId: number, conversationId: string) {
    return this.removeParticipants(conversationId, userId);
  }

  async addParticipants(conversationId: string, userAddedId: number) {
    const userAdded = await this.userService.getUserById(userAddedId);
    if (!userAdded) {
      throw new BadRequestException({
        ...UNAVAILABLE_USER,
        userId: userAddedId,
      });
    }
    const updatedConversation = await this.findOne(conversationId);
    if (!updatedConversation) {
      throw new BadRequestException({ ...UNAVAILABLE_GROUP });
    }
    updatedConversation.users.push(userAdded);
    return this.conversationRepository.save(updatedConversation);
  }

  async removeParticipants(conversationId: string, userRemovedId: number) {
    const userRemoved = await this.userService.getUserById(userRemovedId);
    if (!userRemoved) {
      throw new BadRequestException({ ...UNAVAILABLE_USER });
    }
    const updatedConversation = await this.findOne(conversationId);
    if (!updatedConversation) {
      throw new BadRequestException({ ...UNAVAILABLE_GROUP });
    }
    if (
      !updatedConversation.users.find((user) => user.userId === userRemovedId)
    ) {
      throw new BadRequestException({ ...UNAVAILABLE_USER_IN_CONVERSATION });
    } else {
      updatedConversation.users = updatedConversation.users.filter(
        (user) => user.userId != userRemovedId,
      );
      return this.conversationRepository.save(updatedConversation);
    }
  }

  async updateConversation(conversationId: string, groupName: string) {
    return this.conversationRepository.update(conversationId, { groupName });
  }
}
