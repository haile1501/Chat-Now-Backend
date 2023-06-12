import { NotiStatus, NotificationType } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  notificationId: number;
  @Column({type : 'enum', enum : NotificationType})
  type : NotificationType;
  @ManyToMany(() => User, (user) => user.notifications)
  @JoinTable({
    name: 'notification_user_line',
    joinColumn: {
      name: 'notificationNotificationId',
      referencedColumnName: 'notificationId',
    },
    inverseJoinColumn: {
      name: 'userUserId',
      referencedColumnName: 'userId',
    },
  })
  users : User[]; 
}

