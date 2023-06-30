import { NotiStatus, NotificationType } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  notificationId: number;

  @Column({type : 'enum', enum : NotificationType})
  type : NotificationType;
  
  @Column( {type :'enum', enum :NotiStatus,default : NotiStatus.NOT_READ_YET})
  status : NotiStatus;

  @Column({nullable : true})
  conversationId : string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}

