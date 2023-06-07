import { FriendStatus } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  friendId: number;

  @ManyToOne(() => User ,(sender) => sender.friendRequestsSent)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User , (receiver) => receiver.friendRequestsReceived)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  requestTime: Date;

  @Column({ type: 'enum', enum: FriendStatus })
  status: FriendStatus;
}
