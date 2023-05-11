import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/constant/constant';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  password: string;
}
