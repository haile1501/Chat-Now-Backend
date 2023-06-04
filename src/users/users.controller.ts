import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(HttpAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
