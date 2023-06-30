import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { ConfigService } from '@nestjs/config';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { RtcRole, RtcTokenBuilder } from 'agora-token';
import { CallType } from 'src/constant/constant';


@Controller('call')
export class CallController {
  constructor(
    private readonly callService: CallService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(HttpAuthGuard)
  @Post('gen-token')
  generateRTCToken(
    @Body() generateTokenDto: GenerateTokenDto,
    @Req() request: Request,
  ) {
    const appID = this.configService.get('APP_ID');
    const appCert = this.configService.get('APP_CERTIFICATE');
    const expirationTimeInSeconds = 7200;
    const channelName = generateTokenDto.conversationId;
    const uid = request['user'].userId;
    const role = RtcRole.PUBLISHER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCert,
      channelName,
      uid,
      role,
      expirationTimeInSeconds,
      privilegeExpiredTs,
    );

    return { token, uid };
  }
  @Post()
  async createCallHistory(
    @Query('id') conversationId : string,
    @Query('type') type : CallType,
    @Req() request : Request
  ){
    const userId = request['user'].userId;
    return await this.callService.createCallHistory(conversationId, userId, type);
  }
  @Get()
  async listHistory(
    @Req() request : Request
  ){
    const userId = request['user'].userId;
    return await this.callService.listHistory(userId);
  }
}
