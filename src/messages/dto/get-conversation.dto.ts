import { IsNumber, IsString } from "class-validator";

export class ConversationDto {
    @IsString()
    roomId : string;
}

export class ConversationByIdDto {
    @IsString()
    roomId : string;

    @IsString()
    userSendId : string;
}
