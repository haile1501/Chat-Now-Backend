import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryColumn()
    id : string;

    @Column()
    context : string;

    @Column()
    timeSend: Date;

    @Column()
    userSendId : string;

    @Column()
    roomId : string; 
}
