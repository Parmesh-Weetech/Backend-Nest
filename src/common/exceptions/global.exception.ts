import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { clientLogger } from '../../common/util/client-log';
import { Request, Response } from 'express';
import { apiLogger } from '../util/logs';
import { Meter, metrics } from "@opentelemetry/api"

const meter: Meter = metrics.getMeter('nestjs-backend-meter');
const errorCounter = meter.createCounter('http_server_errors', {
    description: 'Counts of HTTP server errors',
});

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

        // 🔴 SERVER ERROR LOG
        apiLogger.error(logPayload);

        // 🔴 CLIENT ERROR LOG
        if (req.headers['x-client-request'] === 'true') {
            clientLogger.error(logPayload);
        }

        errorCounter.add(1, { message: (response as any).message, ip: req.ip, userAgent: req.headers['user-agent'], duration, url: req.url, method: req.method, status_code: String(status) });

        res.status(status).json(response);
    }
}
