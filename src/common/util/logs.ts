import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const apiLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: true,
            maxFiles: '90d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        }),
    ],
});
