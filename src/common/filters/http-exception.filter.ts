import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { mapPrismaErrorToHttpException } from '@common/utils/map-prisma-error.util';

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
  details?: {
    code: string;
    meta: unknown;
  };
}

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const mappedPrisma = mapPrismaErrorToHttpException(exception);
    const resolved = mappedPrisma?.exception ?? exception;

    const status: number =
      resolved instanceof HttpException ? resolved.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const isServerError = status >= 500;

    if (!(resolved instanceof HttpException) || isServerError) {
      if (exception instanceof Error) {
        this.logger.error(exception.message, exception.stack);
      } else {
        this.logger.error('Unhandled exception', String(exception));
      }
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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

    if (mappedPrisma && process.env.NODE_ENV === 'development') {
      body.details = {
        code: mappedPrisma.code,
        meta: mappedPrisma.meta,
      };
    }

    response.status(status).json(body);
  }
}
