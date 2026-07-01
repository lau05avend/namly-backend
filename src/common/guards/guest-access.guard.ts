import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/constants/auth-metadata.constants';
import {
  GUEST_SESSION_EXPIRED_CODE,
} from '@modules/guests/domain/constants/guest.constants';
import type { RequestContext } from '@shared/context/request-context.interface';

@Injectable()
export class GuestAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.isGuest) {
      return true;
    }

    if (!request.guestExpiresAt) {
      return true;
    }

    const expiresAt = new Date(request.guestExpiresAt);

    if (expiresAt.getTime() > Date.now()) {
      return true;
    }

    throw new ForbiddenException({
      message: 'Guest session expired',
      code: GUEST_SESSION_EXPIRED_CODE,
    });
  }
}
