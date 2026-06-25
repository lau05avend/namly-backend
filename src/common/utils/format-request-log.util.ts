import { SLOW_REQUEST_THRESHOLD_MS } from '@common/constants/logging.constants';
import type { Request } from 'express';

const METHOD_COLUMN_WIDTH = 7;
const PATH_COLUMN_WIDTH = 40;

export interface RequestLogParams {
  readonly method: string;
  readonly path: string;
  readonly statusCode: number;
  readonly durationMs: number;
  readonly environment?: string;
  readonly authUserId?: string | null;
}

export function getRequestPath(request: Request): string {
  const path = request.originalUrl.split('?')[0] ?? request.url;

  return path;
}

function formatPathColumn(path: string): string {
  if (path.length <= PATH_COLUMN_WIDTH) {
    return path.padEnd(PATH_COLUMN_WIDTH, ' ');
  }

  return `${path.slice(0, PATH_COLUMN_WIDTH - 3)}...`;
}

export function formatRequestLogLine(params: RequestLogParams): string {
  const method = params.method.toUpperCase().padEnd(METHOD_COLUMN_WIDTH, ' ');
  const path = formatPathColumn(params.path);
  const status = String(params.statusCode).padStart(3, ' ');
  const duration = `${params.durationMs}ms`.padStart(7, ' ');

  let line = `${method} ${path}  ${status}   ${duration}`;

  if (params.durationMs > SLOW_REQUEST_THRESHOLD_MS) {
    line += '  SLOW';
  }

  if (params.environment === 'development') {
    const user = params.authUserId ?? 'anonymous';
    line += `  user=${user}`;
  }

  return line;
}

export function resolveHttpExceptionMessage(exception: {
  getResponse: () => string | { message?: string | string[] };
}): string {
  const response = exception.getResponse();

  if (typeof response === 'string') {
    return response;
  }

  const { message } = response;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Request failed';
}

export function resolveExceptionName(exception: unknown): string {
  if (exception instanceof Error) {
    return exception.constructor.name;
  }

  return 'Error';
}
