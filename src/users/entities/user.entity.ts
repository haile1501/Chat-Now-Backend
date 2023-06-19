import { Gender, OnlineStatus } from 'src/constant/constant';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Friend } from 'src/friends/entities/friend.entity';
import { Message } from 'src/messages/entities/message.entity';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({nullable :true})
  avatar : string;

  @Column({type: 'enum' , enum : OnlineStatus})
  onlineStatus : OnlineStatus;

  @OneToMany(() => Friend, (friend) => friend.sender)
  friendRequestsSent : Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver)
  friendRequestsReceived : Friend[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];

  @OneToMany(() => NotificationEntity, notification => notification.user)
  notifications : NotificationEntity[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
  
}
