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
    const userId = request['user'].userId;
    return await this.userService.update(userId, updateUserDto);
  }
  @Get(':id')
  async getUserProFile(@Param('id') userId: number) {
    return await this.userService.getUserById(userId);
  }
}
