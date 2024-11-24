import logger from './logger';
import sequelize from '../config/db';

// Generic transaction handler
export const executeTransaction = async <T>(
    callback: (transaction: any) => Promise<T>
): Promise<T> => {
    const transaction = await sequelize.transaction(); // Start a new transaction

    try {
        const result = await callback(transaction); // Execute the user-defined transaction logic
        await transaction.commit(); // Commit the transaction if successful
        logger.info('Transaction committed successfully.');
        return result; // Return the result of the callback
    } catch (error) {
        await transaction.rollback(); // Rollback if any operation fails
        logger.error('Transaction rolled back due to an error:', error);
        throw error; // Rethrow the error for further handling
    }
};
