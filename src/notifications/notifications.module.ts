import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import {  NotificationEntity } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationUserLine } from './entities/notificationuserline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity,NotificationUserLine])],
  providers: [NotificationsGateway, NotificationsService],
  exports : [NotificationsService]
})
export class NotificationsModule {}
