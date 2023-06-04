import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

enum chat_type {
    private = 0,
    groupchat = 1,
}

@Entity()
export class Conversation {
    @PrimaryColumn()
    id : string;
    @Column()
    name : string;
    @Column()
    type : chat_type;
}
