import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const apiLogger = WinstonModule.createLogger({
    transports: [
        // Rotating file transport
        new winston.transports.DailyRotateFile({
            filename: 'logs/server/%DATE%.log',
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: true,
            maxFiles: '90d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),

        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf(info => {
                    return `${info.timestamp} ${info.level} [${info.source || "Unknown"}]: ${info.message}`;
                })
            )
        }),
    ],
});
