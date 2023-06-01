import { IsNumber, IsString } from "class-validator";

export class CreateFriendDto {
    @IsString()
    userSendEmail : string;

    @IsString()
    userReceiveEmail : string;
}


export class AcceptFriendDto {
    @IsString()
    id: string;

    @IsString()
    userSendEmail : string;

    @IsString()
    userReceiveEmail : string;
}
