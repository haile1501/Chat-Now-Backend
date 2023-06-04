import { IsNumber } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  receiverId: number;
}
