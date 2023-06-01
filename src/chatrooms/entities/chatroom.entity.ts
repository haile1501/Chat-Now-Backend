import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chatroom {
    @PrimaryColumn()
    id : string;
}
