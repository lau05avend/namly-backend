import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';

export function ApiPublicOperation(options: ApiOperationOptions): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      ...options,
      security: [],
    }),
  );
}
