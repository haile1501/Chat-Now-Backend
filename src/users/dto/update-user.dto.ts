import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Gender } from 'src/constant/constant';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsDateString()
  @IsOptional()
  dob: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
