import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";

export const apiLogger = WinstonModule.createLogger({
    transports: [
        new transports.File({
            filename: `logs/app.log`,
            format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.Console({
            format: format.combine(
                format.cli(),
                format.splat(),
                format.timestamp(),
                format.printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                }),
            )
        })
    ]
})