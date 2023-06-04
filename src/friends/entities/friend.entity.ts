import { FriendStatus } from 'src/constant/constant';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  friendId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  requestTime: Date;

  @Column({ type: 'enum', enum: FriendStatus })
  status: FriendStatus;
}
