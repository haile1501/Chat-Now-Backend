import { NotiStatus, NotificationType } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  notificationId: number;

  @Column({type : 'enum', enum : NotificationType})
  type : NotificationType;
  
  @Column( {type :'enum', enum :NotiStatus})
  status : NotiStatus;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;
}

