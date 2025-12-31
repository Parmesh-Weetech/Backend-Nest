import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { apiLogger } from '../../common/util/logs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();
        const method = req.method;
        const url = req.url;
        const startTime = Date.now();

        res.on('finish', () => {
            const statusCode = res.statusCode;

            // Only log successful responses
            if (statusCode >= 400) return;

            const duration = Date.now() - startTime;
            const message = (res as any).locals?.logMessage || 'Request successful';

            apiLogger.log({
                level: 'info',
                message,
                context: `${method} ${url} ${statusCode}`,
                duration: `${duration}ms`,
            });
        });

        return next.handle().pipe(
            tap((responseBody) => {
                (res as any).locals = { logMessage: responseBody?.message || 'Request successful' };
            }),
        );
    }
}
