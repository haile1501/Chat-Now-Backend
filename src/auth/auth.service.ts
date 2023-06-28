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
  USER_NOT_FOUND,
  WRONG_EMAIL_OR_PASSWORD,
  WRONG_VERIFICATION_LINK,
} from 'src/constant/error.constant';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { verificationEmail, verificationPassWordEmail } from 'src/constant/email-template.constant';
import { createPassword } from 'src/utils/ids';

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
    await this.mailerService.sendMail({
      from: 'noreply@chatnow.com',
      to: user.email,
      subject: '[ChatNow] Activate Your Account',
      html: verificationEmail(user.email, user.otp),
    });
    return user;
  }

  async resertPassword(email: string){
    const user = await this.userService.findOne(email);
    const newPassword = createPassword();
    if(user){
      await this.mailerService.sendMail({
        from: 'noreply@chatnow.com',
        to: user.email,
        subject: '[ChatNow] Return Your New Password',
        html: verificationPassWordEmail(user.email, user.otp, newPassword),
      })
      return user;
    }
    else{
      throw new Error(...USER_NOT_FOUND);
    }
  }

  async resendEmail(email: string) {
    const user = await this.userService.findOne(email);

    if (user && !user.isActive) {
      await this.mailerService.sendMail({
        from: 'noreply@chatnow.com',
        to: user.email,
        subject: '[ChatNow] Activate Your Account',
        html: verificationEmail(user.email, user.otp),
      });
    }
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

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const { email, otp } = verifyEmailDto;
      const user = await this.userService.findOne(email);

      if (!user || user.otp !== otp) {
        throw new BadRequestException({ ...WRONG_VERIFICATION_LINK });
      }
      user.isActive = true;
      return this.userService.update(user.userId, user);
    } catch {
      throw new BadRequestException();
    }
  }
}
