import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friend {
    @PrimaryColumn()
    id : string;

    @Column()
    userSendEmail : string;

    @Column()
    userReceiveEmail : string;

    @Column({default:false})
    acceptStatus : boolean
    
}
