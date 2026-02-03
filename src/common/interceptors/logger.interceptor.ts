import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { apiLogger } from '../util/logs';
import * as winston from 'winston';
import { getClientLogFilePath } from '../../common/util/client-log'; // Import getClientLogFilePath

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

        // Get the user-agent from the request headers
        const userAgent = req.headers['user-agent'] || '';

        // Dynamically set the log file path based on the user-agent
        const logFilePath = getClientLogFilePath(userAgent);

        // Create a dynamic logger for this request based on the user-agent
        const dynamicClientLogger = winston.createLogger({
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: `logs/client/${logFilePath}/%DATE%.log`, // Use dynamic path
                    datePattern: 'DD-MM-YYYY-HH',
                    zippedArchive: true,
                    maxFiles: '90d',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                    ),
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.cli(),
                        winston.format.splat(),
                        winston.format.timestamp(),
                        winston.format.printf(info => `${info.timestamp} ${info.level} [${info.source || 'Unknown'}]: ${info.message}`)
                    )
                }),
            ],
        });

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
                source: "Server",
                level: this.getLogLevel(statusCode),
                ...logPayload,
            });

            // 🔹 CLIENT LOG (only real client calls)
            if (req.headers['x-client-request'] === 'true') {
                dynamicClientLogger.log({
                    source: "Client",
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
