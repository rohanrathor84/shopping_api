import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

// Extract variables from environment
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, NODE_ENV } = process.env;

// Validate required environment variables
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error('Missing one or more required environment variables for the database connection.');
}

// Initialize Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    dialect: 'mysql',
    logging: NODE_ENV === 'production' ? false : console.log, // Log SQL queries; set to false in production for less noise

    // replication: {
    //     read: [
    //         { host: 'replica1.db.host', username: DB_USER, password: DB_PASSWORD },
    //         { host: 'replica2.db.host', username: DB_USER, password: DB_PASSWORD },
    //     ],
    //     write: { host: DB_HOST, username: DB_USER, password: DB_PASSWORD },
    // },

    // Retry logic for transient errors
    retry: {
        max: 5, // Retry up to 5 times
        match: [
            /Deadlock/, // Retry on MySQL deadlock errors
            /Lock wait timeout exceeded/, // Retry on lock timeout
            /ER_LOCK_DEADLOCK/, // Specific MySQL error codes
        ],
    },

    // Connection pool configuration
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 2, // Minimum number of connections in the pool
        acquire: 30000, // Maximum time (ms) to acquire a connection before throwing an error
        idle: 10000, // Maximum time (ms) a connection can remain idle before being released
    },
});

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the application if the database connection fails
    }
})();

export default sequelize;
