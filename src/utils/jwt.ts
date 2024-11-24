import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// The secret key for JWT signing (in production, store this securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';  // Change this to a real secret key

// Generate JWT token with 24-hour expiration
export const generateToken = (userId: number) => {
    const payload = { id: userId };
    const options = { expiresIn: '24h' };  // Token expires in 24 hours
    return jwt.sign(payload, JWT_SECRET, options);
};

// Verify JWT token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
