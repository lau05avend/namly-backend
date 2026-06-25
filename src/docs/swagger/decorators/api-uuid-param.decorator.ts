import { ApiParam } from '@nestjs/swagger';

export function ApiUuidParam(name: string, description: string, example: string): MethodDecorator {
  return ApiParam({
    name,
    description,
    format: 'uuid',
    example,
  });
}
