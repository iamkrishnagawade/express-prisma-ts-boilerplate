import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errorMiddleware";
import AppError from "./utils/appError";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route for testing
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Handle undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized error handling entry point
app.use(globalErrorHandler);

export default app;
