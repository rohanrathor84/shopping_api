import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
    user?: any;  // Add user field to the request to store authenticated user
}

// Middleware to authenticate the user using JWT token
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];  // Expecting 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;  // Store the decoded token data (user info) in the request
        next();  // Allow the request to proceed
    } catch (error) {
        logger.error('Authentication failed', error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
