import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Store request start time
        (req as any).startTime = Date.now();
        next();
    }
}
