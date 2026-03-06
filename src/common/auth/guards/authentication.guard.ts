import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { JWTValidator } from '../services/jwt-validator.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  protected readonly logger: Logger;
  constructor(
    private readonly tokenValidator: JWTValidator,
    private readonly reflector: Reflector,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async validateRequest(request: Request): Promise<boolean> {
    try {
      const token = request?.headers?.authorization?.split('Bearer ')[1];

      if (!token) {
        throw new Error('Token is missing');
      }

      await this.tokenValidator.validate(token);

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      this.logger.error(`Unauthorized request. Error: ${msg}`);
      throw new UnauthorizedException();
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }
}
