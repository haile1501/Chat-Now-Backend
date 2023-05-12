import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-email')
  resendEmail(@Body('email') email: string) {
    return this.authService.resendEmail(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-access-token')
  verifyAccessToken(@Body('accessToken') accessToken: string) {
    return this.authService.verifyAccessToken(accessToken);
  }
}
