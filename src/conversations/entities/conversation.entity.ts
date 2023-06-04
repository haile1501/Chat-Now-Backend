import { ConversationType } from 'src/constant/constant';
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

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

}
