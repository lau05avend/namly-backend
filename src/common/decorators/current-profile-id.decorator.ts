import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { RequestContext } from '@shared/context/request-context.interface';

export const CurrentProfileId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestContext>();
    const profileId = request.context?.userId ?? request.user?.profile_id;

    if (!profileId) {
      throw new UnauthorizedException('Profile context is missing'); // TODO: mejorar estos mensajes de excepciones
    }

    return profileId;
  },
);
