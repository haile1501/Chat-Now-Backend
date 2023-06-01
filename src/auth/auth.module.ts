import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ChatroomsModule } from 'src/chatrooms/chatrooms.module';
import { MessagesModule } from 'src/messages/messages.module';
import { AuthsGateWay } from './auth.gateway';
import { FriendsModule } from 'src/friends/friends.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    UsersModule,ChatroomsModule,MessagesModule,FriendsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthsGateWay],
  exports: [AuthService],
})
export class AuthModule {}
