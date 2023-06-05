import { IsDate, IsNumber, IsString } from "class-validator";


export class CreateMessageDto {
    @IsString()
    context : string;

    @IsString()
    userSendId : string;

    @IsString()
    roomId : string; 
    
}
