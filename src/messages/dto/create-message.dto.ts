import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";


export class CreateMessageDto {
    @ApiProperty()
    @IsString()
    content : string;
    @ApiProperty()
    @IsString()
    conversationId : string;
}
