import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return true; // visitante
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return true;
    }

    try {
      this.jwtService.verify(token);
      return false; // já logado
    } catch {
      return true;
    }
  }
}
