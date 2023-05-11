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
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  //  @Get(':id')
  //  findOne(@Param('id') id: string) {
  //    return this.userService.findOne(+id);
  //  }
  //
  //  @Patch(':id')
  //  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //    return this.userService.update(+id, updateUserDto);
  //  }
  //
  //  @Delete(':id')
  //  remove(@Param('id') id: string) {
  //    return this.userService.remove(+id);
  //  }
}
