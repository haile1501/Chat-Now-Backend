import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import {  NotificationEntity } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';
import { FriendsModule } from 'src/friends/friends.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]),UsersModule,
  MessagesModule,
  FriendsModule,
  ConversationsModule,
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports : [NotificationsService]
})
export class NotificationsModule {}
