import { PrismaClientKnownRequestError } from '@prisma/client-runtime-utils';

const TRANSIENT_PRISMA_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017']);

export function isTransientDbError(error: unknown): boolean {
  if (error instanceof PrismaClientKnownRequestError) {
    return TRANSIENT_PRISMA_CODES.has(error.code);
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('cannot use a pool after calling end on the pool')) {
      return false;
    }

    return (
      message.includes('server has closed the connection') ||
      message.includes('connection terminated') ||
      message.includes('connection timeout') ||
      message.includes('econnreset')
    );
  }

  return false;
}
