import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;

          this.logger.log({
            message: 'Request completed',
            method,
            url,
            statusCode: response.statusCode,
            delay: `${delay}ms`,
            body: this.sanitizeBody(body),
            response: this.sanitizeResponse(data),
          });
        },
        error: (error: Error) => {
          const delay = Date.now() - now;

          this.logger.error({
            message: 'Request failed',
            method,
            url,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            delay: `${delay}ms`,
            body: this.sanitizeBody(body),
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'authorization'];

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }

  private sanitizeResponse(data: any): any {
    if (!data) return data;

    // Se for um objeto ou array, faz uma cópia para não modificar o original
    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    // Remove campos sensíveis da resposta
    const sensitiveFields = ['password', 'token', 'authorization'];
    if (typeof sanitized === 'object') {
      this.recursiveSanitize(sanitized, sensitiveFields);
    }

    return sanitized;
  }

  private recursiveSanitize(obj: any, sensitiveFields: string[]): void {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
      if (sensitiveFields.includes(key.toLowerCase())) {
        obj[key] = '***';
      } else if (typeof obj[key] === 'object') {
        this.recursiveSanitize(obj[key], sensitiveFields);
      }
    });
  }
}
