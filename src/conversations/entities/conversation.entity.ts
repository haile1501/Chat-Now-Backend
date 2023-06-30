import { Call } from 'src/call/entities/call.entity';
import { CallType, ConversationType } from 'src/constant/constant';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryColumn()
  conversationId: string;

  @Column({ nullable: true })
  groupName: string;

  @Column({ type: 'enum', enum: ConversationType })
  type: ConversationType;

  @Column({
    type: 'enum',
    enum: CallType,
    nullable: true,
    default: CallType.NoCall,
  })
  callType: CallType;

  @Column({ default: 0, nullable: true })
  membersInCall: number;

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Call , (call) => call.conversation)
  calls : Call[]; 

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
