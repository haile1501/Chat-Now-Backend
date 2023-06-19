import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from './users/guard-users';



export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const configService = this.app.get(ConfigService);
    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.use(createTokenMiddleware(jwtService,configService, this.logger));
    

    return server;
  }
}
const createTokenMiddleware =
  (jwtService: JwtService,configService: ConfigService, logger: Logger) =>
  (socket: Socket, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    try {
      const payload = jwtService.verify(token, {
        secret: configService.get<string>('JWT_SECRET'),
      });
      socket.data = payload;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
};
