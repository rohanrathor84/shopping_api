import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Get the current environment
const env = process.env.NODE_ENV || 'development';

// Define log file paths
const logDir = path.join(__dirname, '..', 'logs'); // Logs directory
const errorLogFile = path.join(logDir, 'error.log');
const combinedLogFile = path.join(logDir, 'combined.log');

// Common log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Create the logger instance
const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info', // Log level based on environment
    format: logFormat, // Apply the log format
    transports: [
        // Console transport with colorized output for development
        new transports.Console({
            format: format.combine(
                format.colorize(), // Colorize output for console
                logFormat
            ),
        }),

        // Daily rotation file for error logs
        new transports.DailyRotateFile({
            level: 'error',
            filename: `${logDir}/error-%DATE%.log`, // Rotate daily
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d', // Keep logs for 14 days
        }),

        // Daily rotation file for all logs
        new transports.DailyRotateFile({
            filename: `${logDir}/combined-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d', // Keep logs for 14 days
        }),

        // Write all logs to the combined log file
        new transports.File({ filename: combinedLogFile }),
    ],
});

// Handle uncaught exceptions and rejections
logger.exceptions.handle(
    new transports.File({ filename: errorLogFile }) // Save uncaught exceptions
);
logger.rejections.handle(
    new transports.File({ filename: errorLogFile }) // Save unhandled promise rejections
);

export default logger;
