import Joi from 'joi';

// Define validation schema for signup
export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name should have a minimum length of 3',
        'string.max': 'Name should have a maximum length of 30',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of 6',
    }),
});

// Define validation schema for login
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of 6',
    }),
});

// Define validation schema for updating user
export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional().messages({
        'string.empty': 'Name should not be empty',
        'string.min': 'Name should have a minimum length of 3',
        'string.max': 'Name should have a maximum length of 30',
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password should have a minimum length of 6',
    }),
});
