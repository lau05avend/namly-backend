import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SWAGGER_BEARER_AUTH } from '../swagger.constants';

export function ApiProtectedTag(tag: string): ClassDecorator {
  return applyDecorators(ApiTags(tag), ApiBearerAuth(SWAGGER_BEARER_AUTH));
}
