import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '@common/constants/auth-metadata.constants';
import { AuthService } from '@modules/auth/application/auth.service';
import type { NamlyContextData } from '@shared/context/namly-context.interface';
import type { RequestContext } from '@shared/context/request-context.interface';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestContext>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    request.context = this.buildContext(isPublic, request);
    request.user = request.context.user ?? undefined;

    return next.handle();
  }

  private buildContext(isPublic: boolean, request: RequestContext): NamlyContextData {
    if (isPublic) {
      return {
        isPublic: true,
        userId: null,
        user: null,
        isGuest: false,
        guestExpiresAt: null,
      };
    }

    // TODO: revisar sí manetener authUser y user, o eliminar uno de los dos
    const authUser = request.authUser;

    if (!authUser || !request.authUserId) {
      return {
        isPublic: false,
        userId: null,
        user: null,
        isGuest: false,
        guestExpiresAt: null,
      };
    }

    const user = this.authService.toCurrentUser(authUser, request.profileId ?? request.authUserId);

    return {
      isPublic: false,
      userId: request.profileId ?? request.authUserId,
      user,
      isGuest: request.isGuest ?? false,
      guestExpiresAt: request.guestExpiresAt ?? null,
    };
  }
}
