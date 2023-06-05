import { IsEnum, IsNumber } from 'class-validator';
import { FriendStatus } from 'src/constant/constant';

export class UpdateFriendDto {
  @IsNumber()
  requestId: number;

  @IsEnum({
    each: true,
    eachCustomValue: (value: FriendStatus) => value !== FriendStatus.Waiting,
  })
  status: FriendStatus;
}
