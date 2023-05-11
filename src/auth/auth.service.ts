import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInDto } from './dto/log-in.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from 'src/utils/bcrypt.util';
import {
  UNVERIFIED_ACCOUNT,
  WRONG_EMAIL_OR_PASSWORD,
} from 'src/constant/error.constant';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async logIn(logInDto: LogInDto) {
    const user = await this.userService.findOne(logInDto.email);
    if (!user) {
      throw new UnauthorizedException({ ...WRONG_EMAIL_OR_PASSWORD });
    }

    const isMatched = await verifyPassword(logInDto.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException({ ...WRONG_EMAIL_OR_PASSWORD });
    }

    if (!user.isActive) {
      throw new BadRequestException({ ...UNVERIFIED_ACCOUNT });
    }

    const payload = { ...user };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.createUser(signUpDto);
    const otp = user.otp;
    await this.mailerService.sendMail({
      from: 'bruh',
      to: user.email,
      text: otp,
    });
    return user;
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
