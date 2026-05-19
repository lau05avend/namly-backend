import {
  BadRequestException,
  ConflictException,
  type HttpException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client-runtime-utils';

export interface MappedPrismaError {
  readonly exception: HttpException;
  readonly code: string;
  readonly meta: unknown;
}

function toMappedPrismaError(
  code: string,
  meta: unknown,
  exception: HttpException,
): MappedPrismaError {
  return { code, meta, exception };
}

export function mapPrismaErrorToHttpException(error: unknown): MappedPrismaError | null {
  if (!(error instanceof PrismaClientKnownRequestError)) {
    return null;
  }

  const meta: unknown = error.meta;

  switch (error.code) {
    case 'P2002':
      return toMappedPrismaError(
        'P2002',
        meta,
        new ConflictException('Unique constraint violated'),
      );
    case 'P2003':
      return toMappedPrismaError(
        'P2003',
        meta,
        new BadRequestException('Invalid reference (foreign key)'),
      );
    case 'P2025':
      return toMappedPrismaError('P2025', meta, new NotFoundException('Record not found'));
    default:
      return null;
  }
}
