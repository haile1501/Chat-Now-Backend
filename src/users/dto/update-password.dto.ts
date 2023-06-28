import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePassword {
    @ApiProperty()
    @IsString()
    password : string;
}