import { IsString } from "class-validator";

export class UpdateConversationMemberDto {
    @IsString()
    userId : string;
    @IsString()
    conversationId : string;
}
