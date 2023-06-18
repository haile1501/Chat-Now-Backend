import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  groupName: string;

  @ApiProperty({
    example : [1,2]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  userIds: number[];
}
