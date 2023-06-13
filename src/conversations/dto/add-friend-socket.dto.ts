import { IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class AddUserSocketDto {
    @IsNumber()
    userId : number;
    @IsString()
    conversationId : string;
}