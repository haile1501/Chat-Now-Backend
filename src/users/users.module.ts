import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([User]),MessagesModule, JwtModule,CloudinaryModule.forRoot({
    cloud_name: process.env.CLOUDINARY_NAME || 'dd418p2pf',
    api_key: process.env.CLOUDINARY_API_KEY || '715698493329814',
    api_secret: process.env.CLOUDINARY_API_SECRET || '7KRAE1XAth12n5ShHxJc00KXj0M',
  })
],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
