import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConversationType } from 'src/constant/constant';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  groupName: string | null;

  @ApiProperty({
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  userIds: number[];

  @ApiProperty()
  @IsEnum(ConversationType)
  type: ConversationType;
}
