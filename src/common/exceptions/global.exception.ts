import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { apiLogger } from '../util/logs';

export class APIResponse {
    success: boolean;
    message: string;
    data: any;
    expired: boolean;
    statusCode: number;
}

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

        let status = 500;
        let message = 'Internal server error';
        let expired = false;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();

            if (typeof response === 'string') {
                message = response;
            } else if (typeof response === 'object') {
                message = Array.isArray(response['message'])
                    ? response['message'].join(', ')
                    : response['message'] || message;
                expired = response['expired'] || false;
            }
        } else if (exception.message) {
            message = exception.message;
        }

        apiLogger.log({
            level: 'error',
            message,
            context: `${method} ${url} ${status}`,
            duration,
        });

        const apiResponse: APIResponse = {
            success: false,
            message,
            data: null,
            expired,
            statusCode: status,
        };

        res.status(status).json(apiResponse);
    }
}
