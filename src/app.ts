import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import logger from "./utils/logger";
import userRoutes from "./routes/userRoutes";

dotenv.config(); // Load environment variables from .env file
const port = process.env.PORT ?? 3000;
const allowedOrigins = [`https://localhost:${port}`];
const corsOptions = {
    origin: allowedOrigins, // Specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies for cross-origin requests
    optionsSuccessStatus: 204, // respond to preflight requests with 204 status
};

const app: Application = express();
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server Rohan Kumar");
});

// Use routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
});