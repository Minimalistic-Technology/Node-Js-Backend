import app from './app';
import { env } from './config';
import { logger } from './core/logger';
import { connectDB } from './database';

const startServer = async () => {
  try {
    // Test database connection
    await connectDB();
    logger.info('Database connected successfully.');

    app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();