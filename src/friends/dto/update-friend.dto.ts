import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { FriendStatus } from 'src/constant/constant';

export class UpdateFriendDto {
  @ApiProperty()
  @IsNumber()
  requestId: number;

  @ApiProperty()
  @IsEnum({
    each: true,
    eachCustomValue: (value: FriendStatus) => value !== FriendStatus.Waiting,
  })
  status: FriendStatus;
}
