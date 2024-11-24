import express from 'express';
import { signup, login, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { signupSchema, loginSchema, updateUserSchema } from '../validations/userValidator';
import Joi from 'joi';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Middleware to validate request body against Joi schema
const validate = (schema: Joi.ObjectSchema) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map((err) => err.message).join(', '),
            });
        }
        next();
    };
};

// Route for user signup (no authentication required)
router.post('/signup', validate(signupSchema), signup);

// Route for user login (no authentication required)
router.post('/login', validate(loginSchema), login);

// Route for fetching a user by ID (authentication required)
router.get('/:id', authenticate, getUserById);

// Route for updating user details (authentication required)
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);

// Route for deleting a user (authentication required)
router.delete('/:id', authenticate, deleteUser);

export default router;
