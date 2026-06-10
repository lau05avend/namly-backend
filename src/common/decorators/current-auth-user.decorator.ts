import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import type { RequestContext } from '@shared/context/request-context.interface';

export const CurrentAuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    const authUser = request.authUser;

    if (!authUser) {
      throw new UnauthorizedException('Authenticated user is missing');
    }

    return authUser;
  },
);
