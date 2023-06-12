import { NotiStatus } from "src/constant/constant";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity('notification_user_line')
export class NotificationUserLine {
  @Column({type : 'enum' , enum : NotiStatus})
  status : NotiStatus;
  @PrimaryColumn()
  userUserId : number;
  @PrimaryColumn()
  notificationNotificationId : number;
}