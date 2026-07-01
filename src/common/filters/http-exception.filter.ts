import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { HTTP_REQUEST_LOG_CONTEXT } from '@common/constants/logging.constants';
import {
  formatRequestLogLine,
  getRequestPath,
  resolveExceptionName,
  resolveHttpExceptionMessage,
} from '@common/utils/format-request-log.util';
import { mapPrismaErrorToHttpException } from '@common/utils/map-prisma-error.util';
import type { RequestContext } from '@shared/context/request-context.interface';

interface HttpExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[] | HttpExceptionResponse;
  code?: string;
  details?: {
    code: string;
    meta: unknown;
  };
}

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HTTP_REQUEST_LOG_CONTEXT);

  catch(exception: unknown, host: ArgumentsHost): void {
    const mappedPrisma = mapPrismaErrorToHttpException(exception);
    const resolved = mappedPrisma?.exception ?? exception;

    const status: number =
      resolved instanceof HttpException ? resolved.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestContext>();

    this.logException(request, status, exception, resolved);

    const exceptionResponse =
      resolved instanceof HttpException
        ? (resolved.getResponse() as string | HttpExceptionResponse)
        : 'Internal server error';

    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse.message || exceptionResponse
        : exceptionResponse;

    const body: ErrorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (
      typeof exceptionResponse === 'object' &&
      'code' in exceptionResponse &&
      typeof exceptionResponse.code === 'string'
    ) {
      body.code = exceptionResponse.code;
    }

    if (mappedPrisma && process.env.NODE_ENV === 'development') {
      body.details = {
        code: mappedPrisma.code,
        meta: mappedPrisma.meta,
      };
    }

    response.status(status).json(body);
  }

  private logException(
    request: RequestContext,
    status: number,
    exception: unknown,
    resolved: unknown,
  ): void {
    const startedAt = request.requestStartedAt ?? Date.now();
    const requestLine = formatRequestLogLine({
      method: request.method,
      path: getRequestPath(request),
      statusCode: status,
      durationMs: Date.now() - startedAt,
      environment: process.env.NODE_ENV,
      authUserId: request.authUserId,
    });

    const isExpectedHttpException = resolved instanceof HttpException && status < 500;

    if (isExpectedHttpException) {
      const detail = resolveHttpExceptionMessage(resolved);
      this.logger.warn(`${requestLine}\n${detail}`);
      return;
    }

    const exceptionName = resolveExceptionName(exception);
    this.logger.error(`${requestLine}\n${exceptionName}`);

    if (exception instanceof Error && exception.stack) {
      this.logger.error(exception.stack);
    }
  }
}
