import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

export function ApiStandardErrorResponses(): MethodDecorator {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Token ausente o inválido',
      type: ErrorResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      type: ErrorResponseDto,
    }),
  );
}

export function ApiStandardMutationResponses(): MethodDecorator {
  return applyDecorators(
    ApiStandardErrorResponses(),
    ApiNotFoundResponse({
      description: 'Recurso no encontrado',
      type: ErrorResponseDto,
    }),
    ApiConflictResponse({
      description: 'Conflicto con el estado actual del recurso',
      type: ErrorResponseDto,
    }),
  );
}
