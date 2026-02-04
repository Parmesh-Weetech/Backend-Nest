import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface SerializeConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: SerializeConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: SerializeConstructor) { }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                if (data.data) {
                    data.data = plainToInstance(this.dto, data.data, {
                        excludeExtraneousValues: true,
                    });
                }
                return data;
            })
        );
    }
}