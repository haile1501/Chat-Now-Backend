import { CallType } from "src/constant/constant";
import { Conversation } from "src/conversations/entities/conversation.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Call {
    @PrimaryGeneratedColumn()
    callId : number;

    @Column()
    time : Date;

    @Column({enum : CallType})
    type : CallType;

    @ManyToOne(() => Conversation , (conversation) => conversation.calls)
    conversation : Conversation;

    @OneToOne(() => User, (user) => user.call)
    user : User;

    
}
