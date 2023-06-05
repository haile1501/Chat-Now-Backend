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
} from '@nestjs/common';
import { UsersService } from './users.service';

import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PaginationDto } from 'src/utils/pagination';
import { size } from 'lodash';


@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(HttpAuthGuard)
  @Get()
  findAll(@Query('page') page : number,@Query('size') size: number,
  @Query('type') type : string, @Query('name') name : string ) {
    return this.userService.findAll(page,size,type,name);
  }
}
