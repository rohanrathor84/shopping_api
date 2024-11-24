import User, { UserAttributes } from '../models/User';
import logger from '../utils/logger';
import { executeTransaction } from '../utils/transaction';

// Create a new user
export const createUser = async (userData: UserAttributes) => {
    return executeTransaction(async (transaction) => {
        const user = await User.create(userData, { transaction });
        logger.info(`User created: ${user.email}`);
        return user;
    });
};

// Service function for user login
export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.isValidPassword(password))) {
        throw new Error('Invalid credentials');
    }
    return user;
};

// Get a user by ID
export const getUserById = async (id: number) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }
        return user;
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error fetching user by ID: ${error.message}`);
            throw error; // Rethrow the error after logging
        } else {
            // Handle cases where the error is not an instance of Error (e.g., custom error objects)
            logger.error('Unknown error occurred while fetching user by ID');
            throw new Error('Unknown error occurred');
        }
    }
};

// Update user details
export const updateUser = async (id: number, updates: Partial<UserAttributes>) => {
    return executeTransaction(async (transaction) => {
        const user = await User.findByPk(id, { transaction });
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }
        await user.update(updates, { transaction });
        logger.info(`User updated: ${user.email}`);
        return user;
    });
};

// Delete a user
export const deleteUser = async (id: number) => {
    return executeTransaction(async (transaction) => {
        const user = await User.findByPk(id, { transaction });
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }
        await user.destroy({ transaction });
        logger.info(`User deleted: ${user.email}`);
    });
};
