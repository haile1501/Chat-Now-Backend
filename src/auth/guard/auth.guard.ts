import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  private extractTokenFromHeader(request: Request): string {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? accessToken : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.authService.verifyAccessToken(accessToken);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client : Socket = context.switchToWs().getClient<Socket>();
    const accessToken: string = client.handshake?.headers?.accessToken as string;
    try {
      const payload = await this.authService.verifyAccessToken(accessToken);
    } catch (err) {
      throw new WsException(err);
    }

    return true;
  }
}
