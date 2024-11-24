import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { generateToken } from '../utils/jwt';

// Controller function for signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.createUser({ name, email, password });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Controller function for login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);

        // Generate JWT token
        const token = generateToken(user.id);
        res.status(200).json({ success: true, data: { user, token } });
    } catch (error) {
        next(error);
    }
};

// Controller function for getting a user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id, 10));
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Controller function for updating user details
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);
        const updates = req.body;
        const updatedUser = await userService.updateUser(userId, updates);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

// Controller function for deleting a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id);
        await userService.deleteUser(userId);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
