import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class NonProductionGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('This operation is not available in production');
    }

    return true;
  }
}
