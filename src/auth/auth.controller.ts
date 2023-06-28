import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({ status: 401, description: 'wrong email or password.' })
  @ApiResponse({ status: 200, description: 'logging successfully'})
  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 201, description: 'create user successfully'})
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'verify email successfully'})
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  
  @ApiOperation({ summary: 'Resend email' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'verify email successfully'})
  @ApiBody({description : 'email'})
  @HttpCode(HttpStatus.OK)
  @Post('resend-email')
  resendEmail(@Body('email') email: string) {
    
    return this.authService.resendEmail(email);
  }

  @ApiOperation({ summary: 'resert password email' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'verify email successfully'})
  @ApiBody({description : 'email'})
  @HttpCode(HttpStatus.OK)
  @Post('resert-password')
  async resertPassword(@Body('email') email: string) {
    return this.authService.resertPassword(email);
  }

    
  @ApiOperation({ summary: 'Verify access token' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 200, description: 'verify email successfully'})
  @ApiBody({description : 'accessToken'})
  @HttpCode(HttpStatus.OK)
  @Post('verify-access-token')
  verifyAccessToken(@Body('accessToken') accessToken: string) {
    return this.authService.verifyAccessToken(accessToken);
  }
}
