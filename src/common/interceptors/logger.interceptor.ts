import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { clientLogger } from '../../common/util/client-log';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { apiLogger } from '../util/logs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();

        const method = req.method;
        const url = req.url;
        const startTime = Date.now();

        // Save start time for error filter
        (req as any).startTime = startTime;

        res.on('finish', () => {
            const statusCode = res.statusCode;
            const duration = `${Date.now() - startTime}ms`;

            // Success only (errors handled by exception filter)
            if (statusCode >= 400) return;

            const message = (res as any).locals?.logMessage || 'Request successful';

            const logPayload = {
                message,
                method,
                url,
                statusCode,
                duration,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            };

            // 🔹 SERVER LOG
            apiLogger.log({
                level: this.getLogLevel(statusCode),
                ...logPayload,
            });

            // 🔹 CLIENT LOG (only real client calls)
            if (req.headers['x-client-request'] === 'true') {
                clientLogger.log({
                    level: this.getLogLevel(statusCode),
                    ...logPayload,
                });
            }
        });

        return next.handle().pipe(
            tap(responseBody => {
                (res as any).locals = {
                    logMessage: responseBody?.message,
                };
            }),
        );
    }

    private getLogLevel(statusCode: number): 'debug' | 'info' | 'warn' {
        if (statusCode < 200) return 'debug';
        if (statusCode < 300) return 'info';
        return 'warn';
    }
}
