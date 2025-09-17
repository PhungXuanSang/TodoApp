import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const body = request.body as Record<string, any>;
    const now = Date.now();

    console.log(`[Request] ${method} ${url}`, {
      ...body,
      password: body?.password ? '***hidden***' : undefined,
    });

    return next
      .handle()
      .pipe(
        tap((data: unknown) =>
          console.log(
            `[Response] ${method} ${url} - ${Date.now() - now}ms`,
            data,
          ),
        ),
      );
  }
}
