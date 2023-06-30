import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { request } from 'http';
import { UpdatePassword } from './dto/update-password.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(HttpAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'response friend request' })
  @ApiResponse({ status: 400, description: 'forbiden.' })
  @ApiResponse({ status: 201, description: 'create message successfully ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('type') type: string,
    @Query('name') name: string,
    @Req() request: Request,
  ) {
    const userId = request['user'].userId;
    return this.userService.findAll(page, size, type, name, userId);
  }
  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    console.log(updateUserDto);

    const userId = request['user'].userId;
    await this.userService.update(userId, updateUserDto);
    return this.userService.findOne(request['user'].email);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const userId = request['user'].userId;
    return await this.userService.uploadAvatar(file, userId);
  }
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.userService.uploadFile(file);
  }
  @Get('getAvatar/:id')
  async getAvatarUrl(@Param('id') userId: number) {
    return await this.userService.getAvatarUrl(userId);
  }
  @Patch('changePassword')
  async changePassword(
    @Req() request: Request,
    @Body() updatePassword: UpdatePassword,
  ) {
    const userId = request['user'].userId;
    console.log(userId);
    const password = updatePassword.password;
    return await this.userService.updatePassword(userId, password);
  }
}
