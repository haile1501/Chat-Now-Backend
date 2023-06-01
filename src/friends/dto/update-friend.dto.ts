import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { IsString } from 'class-validator';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {
    @IsString()
    userSendEmail : string;

    @IsString()
    userReceiveEmail : string;
}

