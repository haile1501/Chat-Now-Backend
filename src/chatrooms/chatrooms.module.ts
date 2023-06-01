import { Module } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';
import { ChatroomsController } from './chatrooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Chatroom])],
  controllers: [ChatroomsController],
  providers: [ChatroomsService],
  exports : [ChatroomsService]
})
export class ChatroomsModule {}
