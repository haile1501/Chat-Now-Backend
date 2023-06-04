import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class ConversationMember {
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    conversationId : string;
    @Column()
    userId : string;

}
