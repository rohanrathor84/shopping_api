import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import logger from '../utils/logger';

// Simulated stock market data generator
const generateRandomLineData = () => {
    const data: { time: string; value: number }[] = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            time: new Date(Date.now() - i * 1000).toISOString(), // Past 10 seconds
            value: Math.floor(Math.random() * 100), // Random market value
        });
    }
    return data.reverse(); // Reverse for chronological order
};

export const startLineChartServer = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Adjust based on your frontend's origin
            methods: ['GET', 'POST'],
        },
        maxHttpBufferSize: 1e6, // Allow a max of 1MB per WebSocket message
        pingTimeout: 60000, // Adjust timeout for long-living connections
        path: '/socket.io', // Ensure this matches the client
        transports: ['polling', 'websocket'], // Include both
    });

    logger.info('Socket.IO server for line chart started.');

    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        // Emit initial data on connection
        socket.emit('lineChartData', generateRandomLineData());

        // Emit line chart data every second
        const interval = setInterval(() => {
            const data = generateRandomLineData();
            socket.emit('lineChartData', data);
        }, 1000);

        // Handle client disconnection
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
            clearInterval(interval);
        });

        // Optional: Handle custom events
        socket.on('customEvent', (data) => {
            logger.info(`Received custom event from ${socket.id}:`, data);
        });
    });

    return io;
};
