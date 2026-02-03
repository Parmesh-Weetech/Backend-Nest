import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as winston from 'winston';
import { getClientLogFilePath } from '../../common/util/client-log'; // Ensure this function is imported
import { apiLogger } from '../util/logs';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const startTime = (req as any).startTime || Date.now();
        const duration = `${Date.now() - startTime}ms`;

        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const response = exception instanceof HttpException
            ? exception.getResponse()
            : { message: exception.message || 'Internal server error' };

        const logPayload = {
            message: (response as any).message,
            method: req.method,
            url: req.url,
            statusCode: status,
            duration,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        };

        // Dynamically determine the log file path based on user-agent
        const userAgent = req.headers['user-agent'] || '';
        const logFilePath = getClientLogFilePath(userAgent); // This should map to correct client directory

        // Create a dynamic client logger for error logs based on the user-agent
        const dynamicClientLogger = winston.createLogger({
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: `logs/client/${logFilePath}/%DATE%.log`, // Dynamically assigned log folder
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

        // 🔴 SERVER ERROR LOG
        apiLogger.error({
            source: "Server",
            ...logPayload
        });

        // 🔴 CLIENT ERROR LOG (only real client calls)
        if (req.headers['x-client-request'] == 'true') {
            dynamicClientLogger.error({
                source: "Client",
                ...logPayload
            });
        }

        res.status(status).json(response);
    }
}
