import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import logger from '../utils/logger';
import path from 'path';

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0', // OpenAPI version
    info: {
        title: 'Node.js API Documentation', // API title
        version: '1.0.0', // API version
        description: 'This is the API documentation for our Node.js project.', // Description
    },
    servers: [
        {
            url: 'http://localhost:5000', // Server URL
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: [path.resolve(__dirname, '../routes/*.ts')], // Path to the API docs (adjust as needed)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Function to set up Swagger middleware
export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info('Swagger docs available at http://localhost:5000/api-docs');
};
