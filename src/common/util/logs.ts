import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const apiLogger = WinstonModule.createLogger({
    transports: [
        // 📦 File + SigNoz (structured)
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

        // 🖥 Console (human-readable ONLY)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(
                    info => `${info.timestamp} ${info.level} [${info.source}]: ${info.message}`
                )
            )
        }),
    ],
});
