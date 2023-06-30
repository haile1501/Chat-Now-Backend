import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { Call } from './entities/call.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), ConversationsModule],
  controllers: [CallController],
  providers: [CallService]
})
export class CallModule {}
