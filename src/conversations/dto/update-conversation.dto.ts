import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConversationDto {
  @ApiProperty()
  @IsString()
  groupName : string;
}

export class AddUserDto {
  @ApiProperty()
  @IsNumber()
  userId : number;
}