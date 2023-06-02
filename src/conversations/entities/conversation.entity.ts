import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryColumn()
    id : string;
}
