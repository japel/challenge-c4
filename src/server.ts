import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/search';
import analyticsRoutes from './routes/analytics';
import errorMiddleware from './middleware/error';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Don't start the server when testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
