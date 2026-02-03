import { trace } from '@opentelemetry/api';

export const tracer = trace.getTracer('nestjs-backend');

export function TraceSpan(spanName?: string): MethodDecorator {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // Name span based on parameter or method name
            const name = spanName || `${target.constructor.name}.${String(propertyKey)}`;

            return tracer.startActiveSpan(name, async (span) => {
                try {
                    const result = await originalMethod.apply(this, args);
                    span.setStatus({ code: 1 }); // OK
                    return result;
                } catch (error) {
                    span.recordException(error);
                    span.setStatus({ code: 2 }); // ERROR
                    throw error;
                } finally {
                    span.end();
                }
            });
        };

        return descriptor;
    };
}
