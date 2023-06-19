import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class CreateFriendDto {
  @ApiProperty()
  @IsNumber()
  receiverId: number;
}
