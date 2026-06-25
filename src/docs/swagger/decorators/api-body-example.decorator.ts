import { applyDecorators, type Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiBodyExample(
  dto: Type<unknown>,
  example: Record<string, unknown>,
  description?: string,
): MethodDecorator {
  return applyDecorators(
    ApiBody({
      type: dto,
      description,
      examples: {
        default: {
          summary: 'Ejemplo',
          value: example,
        },
      },
    }),
  );
}
