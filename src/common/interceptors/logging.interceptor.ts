import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Response } from 'express';
import { HTTP_REQUEST_LOG_CONTEXT } from '@common/constants/logging.constants';
import { formatRequestLogLine, getRequestPath } from '@common/utils/format-request-log.util';
import type { RequestContext } from '@shared/context/request-context.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HTTP_REQUEST_LOG_CONTEXT);

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestContext>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    request.requestStartedAt = startedAt;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(this.buildLogLine(request, response.statusCode, startedAt));
      }),
    );
  }

  private buildLogLine(request: RequestContext, statusCode: number, startedAt: number): string {
    return formatRequestLogLine({
      method: request.method,
      path: getRequestPath(request),
      statusCode,
      durationMs: Date.now() - startedAt,
      environment: this.configService.get<string>('app.environment'),
      authUserId: request.authUserId,
    });
  }
}
