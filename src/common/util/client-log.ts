import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Base format for the logs
const baseFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
)

// Function to categorize user-agent into client types
export function getClientType(userAgent: string): string {
    if (/iphone|ipod/i.test(userAgent)) {
        return 'iphone'; // iPhone or iPod
    }
    if (/android/i.test(userAgent)) {
        return 'android'; // Android devices
    }
    if (/ipad|tablet/i.test(userAgent)) {
        return 'tablet'; // Tablets (iPad or generic tablet)
    }
    if (/mobile|chrome|firefox|safari/i.test(userAgent)) {
        return 'web'; // Standard Web Browsers
    }
    if (/postman/i.test(userAgent)) {
        return 'postman'; // Postman requests
    }
    return 'unknown'; // Fallback to unknown for unidentified user agents
}

// Function to generate log file path based on client type
export function getClientLogFilePath(userAgent: string): string {
    const clientType = getClientType(userAgent); // Get the client type from user-agent
    return clientType
}

// Client-side logger (static configuration)
export const clientLogger = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: `logs/client/%DATE%.log`, // Default path, may be overridden dynamically
            datePattern: 'DD-MM-YYYY-HH',
            zippedArchive: true,
            maxFiles: '90d',
            format: baseFormat,
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level} [${info.source || 'Unknown'}]: ${info.message}`)
            )
        }),
    ],
});
