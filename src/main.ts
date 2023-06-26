import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('certificates/localhost.key'),
    cert: fs.readFileSync('certificates/localhost.crt'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  //const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  const clientURL = configService.get('CLIENT_BASE_URL');

  app.enableCors();

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  const config = new DocumentBuilder()
    .setTitle('Chat Now App')
    .setDescription('Chat Now backend API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
