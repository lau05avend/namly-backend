import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/constants/auth-metadata.constants';
import { REGISTERED_USERS_ONLY_KEY } from '@common/constants/guest-metadata.constants';
import { GUEST_FEATURE_RESTRICTED_CODE } from '@modules/guests/domain/constants/guest.constants';
import type { RequestContext } from '@shared/context/request-context.interface';

@Injectable()
export class RegisteredUsersOnlyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiresRegisteredUser = this.reflector.getAllAndOverride<boolean>(
      REGISTERED_USERS_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresRegisteredUser) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.isGuest) {
      return true;
    }

    throw new ForbiddenException({
      message: 'Feature not available for guest users',
      code: GUEST_FEATURE_RESTRICTED_CODE,
    });
  }
}
