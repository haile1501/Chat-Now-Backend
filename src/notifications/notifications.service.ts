import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotiStatus, NotificationType } from 'src/constant/constant';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(NotificationEntity) private readonly notificationRepository : Repository<NotificationEntity>,
    private readonly userService : UsersService){}
  async createNoti(type : NotificationType, userReceiveId : number){
    const user = await this.userService.getUserById(userReceiveId);
    const notification = this.notificationRepository.create({
      type,
      status: NotiStatus.NOT_READ_YET,
      user,
    });
    return this.notificationRepository.save(notification);
  }
  async updateNoti(notificationId : number){
    const notification = await this.notificationRepository.findOneBy({notificationId});
    notification.status = NotiStatus.READED;
    return await this.notificationRepository.save(notification);
  }
  async removeNoti(notificationId : number){
    const notification = await this.notificationRepository.findOneBy({notificationId});
    return await this.notificationRepository.remove(notification);
  }
  async countMessNotReadInOneConversation(conversationId : string, userId : number){
    const noti = await this.notificationRepository.createQueryBuilder()
    .innerJoinAndSelect("notification","user.notifications")
    .where("\"userId\" = :userId AND \"conversationId\" = :conversationId AND type = :notitype AND status = :notiStatus",
    {userId : userId, conversationId : conversationId, notiType : NotificationType.NEW_MESSAGE , notiStatus : NotiStatus.NOT_READ_YET})
    .getMany()
    return noti;
  }
  async updateNotiMess(conversationId: string, userId: number){
    const noti = await this.countMessNotReadInOneConversation(conversationId, userId);
    for (let i = 0; i < noti.length ; i++){
      await this.notificationRepository.update(noti[i].notificationId,{status : NotiStatus.READED});
    }
    return noti;
  }
}
