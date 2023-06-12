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



@Controller('user')
@UseGuards(HttpAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(@Query('page') page : number,@Query('size') size: number,
  @Query('type') type : string, @Query('name') name : string, @Req() request: Request ) {
    const userId = request['user'].userId;
    return await this.userService.findAll(page,size,type,name,userId);
  }
  @Patch()
  async updateUser(@Body() updateUserDto : UpdateUserDto,@Req() request: Request){
    const userId = request['user'].userId;
    return await this.userService.update(userId, updateUserDto);
  }
  @Get(':id')
  async getUserProFile(@Param('id') userId : number){
    return await this.userService.getUserById(userId);
  }

  @Get('getNoti/noti')
  async getNotification(@Req() request : Request){
    const userId = request['user'].userId;
    return await this.userService.getNotification(userId);
  }
}
