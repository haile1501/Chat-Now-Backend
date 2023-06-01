import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';

@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @Post()
  create(id : string) {
    return this.chatroomsService.create(id);
  }
}
