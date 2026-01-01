import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { apiLogger } from '../util/logs.js';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const method = req.method;
        const url = req.url;
        const startTime = (req as any).startTime || Date.now();
        const duration = `${Date.now() - startTime}ms`;

        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const response = exception instanceof HttpException ? exception.getResponse() : {
            message: exception.message || 'Internal server error',
            statusCode: status,
        };

        // Log every error
        apiLogger.log({
            level: 'error',
            message: (response as any).message || 'Error occurred',
            context: `${method} ${url} ${status}`,
            duration,
        });

        // Send JSON response to frontend
        res.status(status).json(response);
    }
}
