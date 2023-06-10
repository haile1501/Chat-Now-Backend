import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateConversationDto {
  @IsString()
  groupName : string;
}

export class AddUserDto {
  @IsNumber()
  userId : number;
}