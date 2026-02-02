import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { clientLogger } from '../../common/util/client-log';
import { Request, Response } from 'express';
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

        // 🔴 SERVER ERROR LOG
        apiLogger.error(logPayload);

        // 🔴 CLIENT ERROR LOG
        if (req.headers['x-client-request'] === 'true') {
            clientLogger.error(logPayload);
        }

        res.status(status).json(response);
    }
}
