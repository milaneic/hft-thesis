import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header not found');

    const token = authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });

      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
