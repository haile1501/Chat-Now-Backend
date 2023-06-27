import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { FriendsModule } from './friends/friends.module';
import { JwtModule } from '@nestjs/jwt';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CallModule } from './call/call.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get<TypeOrmModuleOptions>('database'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get<MailerOptions>('nodemailer'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FriendsModule,
    JwtModule,
    ConversationsModule,
    MessagesModule,
    ChatModule,
    NotificationsModule,
    CallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
