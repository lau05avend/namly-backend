import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common/constants/auth-metadata.constants';
import { AuthService } from '@modules/auth/application/auth.service';
import type { RequestContext } from '@shared/context/request-context.interface';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestContext>();
    const accessToken = this.extractBearerToken(request);

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    const authUser = await this.authService.validateAccessToken(accessToken);

    request.authUserId = authUser.id;
    request.authUser = authUser;

    return true;
  }

  private extractBearerToken(request: RequestContext): string | null {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.slice('Bearer '.length).trim();

    return token.length > 0 ? token : null;
  }
}
