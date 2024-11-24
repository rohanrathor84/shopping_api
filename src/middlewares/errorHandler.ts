import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error handler middleware
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default error values
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging purposes (can be enhanced to use a logger like Winston)
    logger.error(`${req.method} ${req.url} - ${message} - Status Code: ${statusCode}`);

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack, // Hide stack trace in production
    });
};
