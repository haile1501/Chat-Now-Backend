import { IsString } from "class-validator";

export class CreateConversationMemberDto {
    @IsString()
    userSendId : string;
    @IsString()
    userReceiveId : string;
}
