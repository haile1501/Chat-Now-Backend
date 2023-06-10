import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  groupName: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  userIds: number[];
}
