import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/errorMiddleware.js';
import AppError from './utils/appError.js';
import userRoutes from './routes/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpecification from './docs/openapi.js';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Basic Route for testing
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// routes
app.use('/api/users', userRoutes);

// Handle undefined routes
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling entry point
app.use(globalErrorHandler);

export default app;
